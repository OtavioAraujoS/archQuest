import { vi } from 'vitest'

import type {
  SpellingRequest,
  SpellingResponse,
} from '@/lib/spelling/spelling-protocol'

type WorkerListener = (event: { data: SpellingResponse }) => void

export function createFakeSpellingWorker() {
  const listeners = new Map<string, WorkerListener>()
  const receivedRequests: SpellingRequest[] = []

  const worker = {
    postMessage: vi.fn((request: SpellingRequest) => {
      receivedRequests.push(request)
    }),
    addEventListener: vi.fn((type: string, listener: WorkerListener) => {
      listeners.set(type, listener)
    }),
    terminate: vi.fn(),
  }

  return {
    worker: worker as unknown as Worker,
    terminate: worker.terminate,
    receivedRequests,
    respond(response: SpellingResponse) {
      listeners.get('message')?.({ data: response })
    },
    crash() {
      listeners.get('error')?.({ data: { id: 0, kind: 'failed' } })
    },
  }
}

export type FakeSpellingWorker = ReturnType<typeof createFakeSpellingWorker>
