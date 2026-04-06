import { ipcMain, app } from 'electron'
import { nanoid } from 'nanoid'
import { getGroups, setGroups } from './store'
import { syncGroupsToHostsFile } from './hosts-file'
import type { HostGroup, HostEntry } from './store'

function saveOnly(groups: HostGroup[]): HostGroup[] {
  setGroups(groups)
  return groups
}

export function registerIpcHandlers(): void {
  ipcMain.handle('hosts:get-groups', () => {
    return getGroups()
  })

  ipcMain.handle('hosts:add-group', (_, name: string) => {
    const groups = getGroups()
    const newGroup: HostGroup = {
      id: nanoid(),
      name,
      enabled: true,
      entries: []
    }
    groups.push(newGroup)
    return saveOnly(groups)
  })

  ipcMain.handle('hosts:update-group', (_, id: string, name: string) => {
    const groups = getGroups()
    const group = groups.find((g) => g.id === id)
    if (group) {
      group.name = name
      return saveOnly(groups)
    }
    return groups
  })

  ipcMain.handle('hosts:delete-group', (_, id: string) => {
    const groups = getGroups().filter((g) => g.id !== id)
    return saveOnly(groups)
  })

  ipcMain.handle('hosts:toggle-group', (_, id: string) => {
    const groups = getGroups()
    const group = groups.find((g) => g.id === id)
    if (group) {
      group.enabled = !group.enabled
      return saveOnly(groups)
    }
    return groups
  })

  ipcMain.handle(
    'hosts:add-entry',
    (_, groupId: string, ip: string, hostname: string) => {
      const groups = getGroups()
      const group = groups.find((g) => g.id === groupId)
      if (group) {
        const newEntry: HostEntry = { id: nanoid(), ip, hostname }
        group.entries.push(newEntry)
        return saveOnly(groups)
      }
      return groups
    }
  )

  ipcMain.handle(
    'hosts:update-entry',
    (_, groupId: string, entryId: string, ip: string, hostname: string) => {
      const groups = getGroups()
      const group = groups.find((g) => g.id === groupId)
      if (group) {
        const entry = group.entries.find((e) => e.id === entryId)
        if (entry) {
          entry.ip = ip
          entry.hostname = hostname
          return saveOnly(groups)
        }
      }
      return groups
    }
  )

  ipcMain.handle('hosts:delete-entry', (_, groupId: string, entryId: string) => {
    const groups = getGroups()
    const group = groups.find((g) => g.id === groupId)
    if (group) {
      group.entries = group.entries.filter((e) => e.id !== entryId)
      return saveOnly(groups)
    }
    return groups
  })

  ipcMain.handle('hosts:sync', async () => {
    const groups = getGroups()
    await syncGroupsToHostsFile(groups)
  })

  ipcMain.handle('app:quit', () => {
    app.quit()
  })
}
