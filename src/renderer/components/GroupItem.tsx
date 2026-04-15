import { useState } from 'react'
import type { HostGroup } from '../lib/types'

interface Props {
  group: HostGroup
  selected: boolean
  onSelect: () => void
  onToggle: () => void
  onDelete: () => void
  onRename: (name: string) => void
}

export default function GroupItem({
  group,
  selected,
  onSelect,
  onToggle,
  onDelete,
  onRename
}: Props) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(group.name)

  const startEditing = () => {
    setEditName(group.name)
    setEditing(true)
  }

  const handleRename = () => {
    const name = editName.trim()
    if (name && name !== group.name) {
      onRename(name)
    }
    setEditing(false)
  }

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 cursor-pointer border-l-2 transition-colors ${
        selected
          ? 'bg-[#1e1e3e] border-[#6c6cf0]'
          : 'border-transparent hover:bg-[#1a1a35]'
      }`}
      onClick={onSelect}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className={`w-8 h-4 rounded-full relative shrink-0 transition-colors ${
          group.enabled ? 'bg-[#6c6cf0]' : 'bg-[#3a3a5c]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            group.enabled ? 'left-4' : 'left-0.5'
          }`}
        />
      </button>

      {editing ? (
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') setEditing(false)
          }}
          onBlur={handleRename}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-[#1e1e3a] border border-[#3a3a6a] rounded px-1 py-0 text-sm text-white outline-none focus:border-[#6c6cf0]"
        />
      ) : (
        <span
          className={`flex-1 text-sm truncate ${
            group.enabled ? 'text-white' : 'text-[#666688]'
          }`}
          onDoubleClick={(e) => {
            e.stopPropagation()
            startEditing()
          }}
        >
          {group.name}
        </span>
      )}

      <span className="text-[10px] text-[#555577] shrink-0">
        {group.entries.length}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation()
          startEditing()
        }}
        className="text-[#555577] hover:text-[#8888ff] opacity-0 group-hover:opacity-100 text-xs shrink-0"
        title="이름 변경"
      >
        이름변경
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          if (confirm(`"${group.name}" 그룹을 삭제하시겠습니까?`)) {
            onDelete()
          }
        }}
        className="text-[#555577] hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs shrink-0"
      >
        x
      </button>
    </div>
  )
}
