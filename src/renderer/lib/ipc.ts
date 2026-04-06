import type { HostGroup } from './types'

declare global {
  interface Window {
    electronAPI: {
      getGroups: () => Promise<HostGroup[]>
      addGroup: (name: string) => Promise<HostGroup[]>
      updateGroup: (id: string, name: string) => Promise<HostGroup[]>
      deleteGroup: (id: string) => Promise<HostGroup[]>
      toggleGroup: (id: string) => Promise<HostGroup[]>
      addEntry: (groupId: string, ip: string, hostname: string) => Promise<HostGroup[]>
      updateEntry: (
        groupId: string,
        entryId: string,
        ip: string,
        hostname: string
      ) => Promise<HostGroup[]>
      deleteEntry: (groupId: string, entryId: string) => Promise<HostGroup[]>
      sync: () => Promise<void>
      quit: () => Promise<void>
    }
  }
}

export const api = window.electronAPI
