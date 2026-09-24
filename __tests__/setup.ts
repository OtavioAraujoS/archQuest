import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'
import 'fake-indexeddb/auto'
import './polyfills/dialog-element'

const ASYNC_QUERY_TIMEOUT_UNDER_FULL_SUITE_LOAD_MS = 3000

configure({ asyncUtilTimeout: ASYNC_QUERY_TIMEOUT_UNDER_FULL_SUITE_LOAD_MS })

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
