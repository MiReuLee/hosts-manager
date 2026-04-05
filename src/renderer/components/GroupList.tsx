import { useState } from 'react'
import type { HostGroup } from '../lib/types'
import GroupItem from './GroupItem'

interface Props {
  groups: HostGroup[]
  selectedGroupId: string | null
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onAdd: (name: string) => void
}

export default function GroupList({
  groups,
  selectedGroupId,
  onSelect,
  onToggle,
  onDelete,
  onRename,
  onAdd
}: Props) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    const name = newName.trim()
    if (name) {
      onAdd(name)
      setNewName('')
      setAdding(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#16162a]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a4a]">
        <span className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider">
          Groups
        </span>
        <button
          onClick={() => setAdding(true)}
          className="text-[#6c6cf0] hover:text-[#8888ff] text-lg leading-none"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <GroupItem
            key={group.id}
            group={group}
            selected={group.id === selectedGroupId}
            onSelect={() => onSelect(group.id)}
            onToggle={() => onToggle(group.id)}
            onDelete={() => onDelete(group.id)}
            onRename={(name) => onRename(group.id, name)}
          />
        ))}

        {groups.length === 0 && !adding && (
          <div className="px-3 py-8 text-center text-[#555577] text-sm">
            그룹을 추가하세요
          </div>
        )}

        {adding && (
          <div className="px-3 py-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') {
                  setAdding(false)
                  setNewName('')
                }
              }}
              onBlur={() => {
                if (newName.trim()) handleAdd()
                else {
                  setAdding(false)
                  setNewName('')
                }
              }}
              placeholder="그룹 이름"
              className="w-full bg-[#1e1e3a] border border-[#3a3a6a] rounded px-2 py-1 text-sm text-white outline-none focus:border-[#6c6cf0]"
            />
          </div>
        )}
      </div>
    </div>
  )
}
