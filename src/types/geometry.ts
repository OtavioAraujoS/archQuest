
export interface Size {
  width: number
  height: number
}

export interface Bounds extends Size {
  x: number
  y: number
}

export interface MenuRect extends Size {
  left: number
  top: number
}

export type RequestedSize = Partial<Size>

export interface EdgeDeltas {
  top: number
  right: number
  bottom: number
  left: number
}
