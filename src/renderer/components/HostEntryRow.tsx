import { useState } from 'react'
import type { HostEntry } from '../lib/types'

interface Props {
  entry: HostEntry
  onUpdate: (ip: string, hostname: string) => void
  onDelete: () => void
}

export default function HostEntryRow({ entry, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [editIp, setEditIp] = useState(entry.ip)
  const [editHostname, setEditHostname] = useState(entry.hostname)

  const handleSave = () => {
    const ip = editIp.trim()
    const hostname = editHostname.trim()
    if (ip && hostname) {
      onUpdate(ip, hostname)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2a2a4a] bg-[#1e1e3a]">
        <input
          autoFocus
          value={editIp}
          onChange={(e) => setEditIp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditing(false)
          }}
          className="w-28 bg-[#16162a] border border-[#3a3a6a] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#6c6cf0] font-mono"
        />
        <input
          value={editHostname}
          onChange={(e) => setEditHostname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="flex-1 bg-[#16162a] border border-[#3a3a6a] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#6c6cf0] font-mono"
        />
        <button
          onClick={handleSave}
          className="text-[#6c6cf0] hover:text-[#8888ff] text-xs"
        >
          저장
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-[#555577] hover:text-[#888] text-xs"
        >
          취소
        </button>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2 px-4 py-2 border-b border-[#2a2a4a] hover:bg-[#1e1e3a]">
      <span className="w-28 text-xs font-mono text-[#8888aa] flex-shrink-0">
        {entry.ip}
      </span>
      <span className="flex-1 text-xs font-mono text-white truncate">
        {entry.hostname}
      </span>
      <button
        onClick={() => {
          setEditIp(entry.ip)
          setEditHostname(entry.hostname)
          setEditing(true)
        }}
        className="text-[#555577] hover:text-[#8888ff] opacity-0 group-hover:opacity-100 text-xs"
      >
        편집
      </button>
      <button
        onClick={onDelete}
        className="text-[#555577] hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs"
      >
        삭제
      </button>
    </div>
  )
}
