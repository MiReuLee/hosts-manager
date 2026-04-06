import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  getGroups: () => ipcRenderer.invoke('hosts:get-groups'),
  addGroup: (name: string) => ipcRenderer.invoke('hosts:add-group', name),
  updateGroup: (id: string, name: string) =>
    ipcRenderer.invoke('hosts:update-group', id, name),
  deleteGroup: (id: string) => ipcRenderer.invoke('hosts:delete-group', id),
  toggleGroup: (id: string) => ipcRenderer.invoke('hosts:toggle-group', id),
  addEntry: (groupId: string, ip: string, hostname: string) =>
    ipcRenderer.invoke('hosts:add-entry', groupId, ip, hostname),
  updateEntry: (groupId: string, entryId: string, ip: string, hostname: string) =>
    ipcRenderer.invoke('hosts:update-entry', groupId, entryId, ip, hostname),
  deleteEntry: (groupId: string, entryId: string) =>
    ipcRenderer.invoke('hosts:delete-entry', groupId, entryId),
  sync: () => ipcRenderer.invoke('hosts:sync'),
  quit: () => ipcRenderer.invoke('app:quit')
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
