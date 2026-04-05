import { useState } from 'react'
import type { HostGroup } from '../lib/types'
import HostEntryRow from './HostEntryRow'

interface Props {
  group: HostGroup | null
  onAddEntry: (ip: string, hostname: string) => void
  onUpdateEntry: (entryId: string, ip: string, hostname: string) => void
  onDeleteEntry: (entryId: string) => void
}

export default function HostEntryList({
  group,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry
}: Props) {
  const [adding, setAdding] = useState(false)
  const [newIp, setNewIp] = useState('127.0.0.1')
  const [newHostname, setNewHostname] = useState('')

  const handleAdd = () => {
    const ip = newIp.trim()
    const hostname = newHostname.trim()
    if (ip && hostname) {
      onAddEntry(ip, hostname)
      setNewIp('127.0.0.1')
      setNewHostname('')
      setAdding(false)
    }
  }

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#555577] text-sm">
        그룹을 선택하세요
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a4a] min-w-0">
        <div className="min-w-0 flex items-center">
          <span className="text-sm font-medium text-white truncate">{group.name}</span>
          <span
            className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
              group.enabled
                ? 'bg-[#6c6cf0]/20 text-[#8888ff]'
                : 'bg-[#3a3a5c]/30 text-[#666688]'
            }`}
          >
            {group.enabled ? 'ON' : 'OFF'}
          </span>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="text-[#6c6cf0] hover:text-[#8888ff] text-sm whitespace-nowrap flex-shrink-0"
        >
          + 항목 추가
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {adding && (
          <div className="px-4 py-3 bg-[#1e1e3a] border-b border-[#2a2a4a] space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-[#8888aa] w-10 flex-shrink-0">IP</label>
              <input
                autoFocus
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setAdding(false)
                    setNewHostname('')
                  }
                }}
                placeholder="127.0.0.1"
                className="flex-1 bg-[#16162a] border border-[#3a3a6a] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#6c6cf0] font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-[#8888aa] w-10 flex-shrink-0">Host</label>
              <input
                value={newHostname}
                onChange={(e) => setNewHostname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd()
                  if (e.key === 'Escape') {
                    setAdding(false)
                    setNewHostname('')
                  }
                }}
                placeholder="myapp.local"
                className="flex-1 bg-[#16162a] border border-[#3a3a6a] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#6c6cf0] font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setAdding(false)
                  setNewHostname('')
                }}
                className="text-[#555577] hover:text-[#888] text-xs px-3 py-1"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                className="bg-[#6c6cf0] hover:bg-[#5a5ae0] text-white text-xs px-3 py-1 rounded"
              >
                추가
              </button>
            </div>
          </div>
        )}

        {group.entries.map((entry) => (
          <HostEntryRow
            key={entry.id}
            entry={entry}
            onUpdate={(ip, hostname) => onUpdateEntry(entry.id, ip, hostname)}
            onDelete={() => onDeleteEntry(entry.id)}
          />
        ))}

        {group.entries.length === 0 && !adding && (
          <div className="px-4 py-8 text-center text-[#555577] text-sm">
            호스트 항목이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
