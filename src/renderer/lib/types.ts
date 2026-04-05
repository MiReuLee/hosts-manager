export interface HostEntry {
  id: string
  ip: string
  hostname: string
}

export interface HostGroup {
  id: string
  name: string
  enabled: boolean
  entries: HostEntry[]
}

export interface AppState {
  groups: HostGroup[]
  version: number
}
