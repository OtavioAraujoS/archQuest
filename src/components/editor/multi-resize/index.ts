import GroupResizeBehavior from './GroupResizeBehavior'
import MultiSelectionResizeHandles from './MultiSelectionResizeHandles'

export default {
  __init__: ['multiSelectionResizeHandles', 'groupResizeBehavior'],
  multiSelectionResizeHandles: ['type', MultiSelectionResizeHandles],
  groupResizeBehavior: ['type', GroupResizeBehavior],
}
