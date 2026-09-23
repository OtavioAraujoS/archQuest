import type { PaletteGroup } from '../palette-group'
import { EVENT_GROUP } from './events'
import { GATEWAY_GROUP } from './gateways'
import { SUBPROCESS_GROUP } from './subprocesses'
import { TASK_GROUP } from './tasks'

export const PALETTE_GROUPS: PaletteGroup[] = [
  EVENT_GROUP,
  GATEWAY_GROUP,
  TASK_GROUP,
  SUBPROCESS_GROUP,
]
