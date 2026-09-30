import { createSpellingWorker } from '@/lib/spelling/create-spelling-worker'
import type {
  SpellingQuestion,
  SpellingResponse,
} from '@/lib/spelling/spelling-protocol'

export const IDLE_WORKER_LIFETIME_MS = 120_000

type ReceiveAnswer = (response: SpellingResponse) => void

let worker: Worker | null = null
let isEngineUnavailable = false
let nextRequestId = 1
let idleStopTimer: ReturnType<typeof setTimeout> | undefined
const pendingAnswers = new Map<number, ReceiveAnswer>()
const knownMisspellings = new Map<string, boolean>()
const knownSuggestions = new Map<string, string[]>()

function stopWorker() {
  clearTimeout(idleStopTimer)
  worker?.terminate()
  worker = null
}

function giveUpOnSpelling() {
  isEngineUnavailable = true
  stopWorker()
  const abandonedAnswers = [...pendingAnswers]
  pendingAnswers.clear()
  for (const [id, receiveAnswer] of abandonedAnswers) {
    receiveAnswer({ id, kind: 'failed' })
  }
}

function deliverAnswer(event: MessageEvent<SpellingResponse>) {
  const response = event.data
  const receiveAnswer = pendingAnswers.get(response.id)
  pendingAnswers.delete(response.id)
  receiveAnswer?.(response)

  if (response.kind === 'failed') return giveUpOnSpelling()
  if (pendingAnswers.size === 0) {
    idleStopTimer = setTimeout(stopWorker, IDLE_WORKER_LIFETIME_MS)
  }
}

function startWorker() {
  const startedWorker = createSpellingWorker()
  startedWorker?.addEventListener('message', deliverAnswer)
  startedWorker?.addEventListener('error', giveUpOnSpelling)
  return startedWorker
}

function askWorker(question: SpellingQuestion): Promise<SpellingResponse> {
  if (!isEngineUnavailable) worker ??= startWorker()
  const runningWorker = worker
  if (!runningWorker) {
    isEngineUnavailable = true
    return Promise.resolve({ id: 0, kind: 'failed' })
  }

  clearTimeout(idleStopTimer)
  const id = nextRequestId++
  return new Promise((resolve) => {
    pendingAnswers.set(id, resolve)
    runningWorker.postMessage({ ...question, id })
  })
}

export function isSpellingEngineUnavailable() {
  return isEngineUnavailable
}

export async function checkWords(words: string[]): Promise<ReadonlySet<string>> {
  const uncheckedWords = [...new Set(words)].filter(
    (word) => !knownMisspellings.has(word),
  )

  if (uncheckedWords.length > 0) {
    const response = await askWorker({ kind: 'check', words: uncheckedWords })
    if (response.kind !== 'checked') return new Set()
    for (const word of uncheckedWords) {
      knownMisspellings.set(word, response.misspelled.includes(word))
    }
  }

  return new Set(words.filter((word) => knownMisspellings.get(word)))
}

export async function suggestCorrections(word: string): Promise<string[]> {
  const rememberedSuggestions = knownSuggestions.get(word)
  if (rememberedSuggestions) return rememberedSuggestions

  const response = await askWorker({ kind: 'suggest', word })
  if (response.kind !== 'suggested') return []
  knownSuggestions.set(word, response.suggestions)
  return response.suggestions
}
