import { useState, useEffect, useCallback } from 'react'
import type { HostGroup } from '../lib/types'
import { api } from '../lib/ipc'

export function useGroups() {
  const [groups, setGroups] = useState<HostGroup[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGroups().then((g) => {
      setGroups(g)
      if (g.length > 0 && !selectedGroupId) {
        setSelectedGroupId(g[0].id)
      }
      setLoading(false)
    })
  }, [])

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null

  const addGroup = useCallback(async (name: string) => {
    const updated = await api.addGroup(name)
    setGroups(updated)
    const newGroup = updated[updated.length - 1]
    if (newGroup) setSelectedGroupId(newGroup.id)
  }, [])

  const updateGroup = useCallback(async (id: string, name: string) => {
    const updated = await api.updateGroup(id, name)
    setGroups(updated)
  }, [])

  const deleteGroup = useCallback(
    async (id: string) => {
      const updated = await api.deleteGroup(id)
      setGroups(updated)
      if (selectedGroupId === id) {
        setSelectedGroupId(updated.length > 0 ? updated[0].id : null)
      }
    },
    [selectedGroupId]
  )

  const toggleGroup = useCallback(async (id: string) => {
    const updated = await api.toggleGroup(id)
    setGroups(updated)
  }, [])

  const addEntry = useCallback(
    async (ip: string, hostname: string) => {
      if (!selectedGroupId) return
      const updated = await api.addEntry(selectedGroupId, ip, hostname)
      setGroups(updated)
    },
    [selectedGroupId]
  )

  const updateEntry = useCallback(
    async (entryId: string, ip: string, hostname: string) => {
      if (!selectedGroupId) return
      const updated = await api.updateEntry(selectedGroupId, entryId, ip, hostname)
      setGroups(updated)
    },
    [selectedGroupId]
  )

  const deleteEntry = useCallback(
    async (entryId: string) => {
      if (!selectedGroupId) return
      const updated = await api.deleteEntry(selectedGroupId, entryId)
      setGroups(updated)
    },
    [selectedGroupId]
  )

  return {
    groups,
    selectedGroup,
    selectedGroupId,
    setSelectedGroupId,
    loading,
    addGroup,
    updateGroup,
    deleteGroup,
    toggleGroup,
    addEntry,
    updateEntry,
    deleteEntry
  }
}
