import { ipcMain } from 'electron'
import { nanoid } from 'nanoid'
import { getGroups, setGroups } from './store'
import { syncGroupsToHostsFile } from './hosts-file'
import type { HostGroup, HostEntry } from './store'

let syncTimer: ReturnType<typeof setTimeout> | null = null

function debouncedSync(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (syncTimer) clearTimeout(syncTimer)
    syncTimer = setTimeout(async () => {
      try {
        await syncGroupsToHostsFile(getGroups())
        resolve()
      } catch (err) {
        reject(err)
      }
    }, 300)
  })
}

async function syncAndSave(groups: HostGroup[]): Promise<HostGroup[]> {
  setGroups(groups)
  await syncGroupsToHostsFile(groups)
  return groups
}

export function registerIpcHandlers(): void {
  ipcMain.handle('hosts:get-groups', () => {
    return getGroups()
  })

  ipcMain.handle('hosts:add-group', async (_, name: string) => {
    const groups = getGroups()
    const newGroup: HostGroup = {
      id: nanoid(),
      name,
      enabled: true,
      entries: []
    }
    groups.push(newGroup)
    return syncAndSave(groups)
  })

  ipcMain.handle('hosts:update-group', async (_, id: string, name: string) => {
    const groups = getGroups()
    const group = groups.find((g) => g.id === id)
    if (group) {
      group.name = name
      return syncAndSave(groups)
    }
    return groups
  })

  ipcMain.handle('hosts:delete-group', async (_, id: string) => {
    const groups = getGroups().filter((g) => g.id !== id)
    return syncAndSave(groups)
  })

  ipcMain.handle('hosts:toggle-group', async (_, id: string) => {
    const groups = getGroups()
    const group = groups.find((g) => g.id === id)
    if (group) {
      group.enabled = !group.enabled
      return syncAndSave(groups)
    }
    return groups
  })

  ipcMain.handle(
    'hosts:add-entry',
    async (_, groupId: string, ip: string, hostname: string) => {
      const groups = getGroups()
      const group = groups.find((g) => g.id === groupId)
      if (group) {
        const newEntry: HostEntry = { id: nanoid(), ip, hostname }
        group.entries.push(newEntry)
        return syncAndSave(groups)
      }
      return groups
    }
  )

  ipcMain.handle(
    'hosts:update-entry',
    async (_, groupId: string, entryId: string, ip: string, hostname: string) => {
      const groups = getGroups()
      const group = groups.find((g) => g.id === groupId)
      if (group) {
        const entry = group.entries.find((e) => e.id === entryId)
        if (entry) {
          entry.ip = ip
          entry.hostname = hostname
          return syncAndSave(groups)
        }
      }
      return groups
    }
  )

  ipcMain.handle('hosts:delete-entry', async (_, groupId: string, entryId: string) => {
    const groups = getGroups()
    const group = groups.find((g) => g.id === groupId)
    if (group) {
      group.entries = group.entries.filter((e) => e.id !== entryId)
      return syncAndSave(groups)
    }
    return groups
  })
}
