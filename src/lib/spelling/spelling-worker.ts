import { Espells } from 'espells'

import type {
  SpellingRequest,
  SpellingResponse,
} from '@/lib/spelling/spelling-protocol'
import {
  createSpellingRequestHandler,
  type WordChecker,
} from '@/lib/spelling/spelling-request-handler'

interface SpellingWorkerScope {
  postMessage(response: SpellingResponse): void
  addEventListener(
    type: 'message',
    listener: (event: MessageEvent<SpellingRequest>) => void,
  ): void
}

const WORD_EVERY_PORTUGUESE_DICTIONARY_KNOWS = 'processo'

async function loadPortugueseChecker(): Promise<WordChecker> {
  const [{ default: aff }, { default: dic }] = await Promise.all([
    import('dictionary-pt-files/index.aff?raw'),
    import('dictionary-pt-files/index.dic?raw'),
  ])
  const checker = new Espells({ aff, dic })
  if (!checker.lookup(WORD_EVERY_PORTUGUESE_DICTIONARY_KNOWS).correct) {
    throw new Error('Portuguese dictionary failed its self check')
  }
  return checker
}

const workerScope = self as unknown as SpellingWorkerScope
const answerSpellingRequest = createSpellingRequestHandler(
  loadPortugueseChecker,
)

workerScope.addEventListener('message', (event) => {
  void answerSpellingRequest(event.data).then((response) =>
    workerScope.postMessage(response),
  )
})
