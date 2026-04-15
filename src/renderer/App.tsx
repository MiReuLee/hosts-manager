import { useGroups } from './hooks/useGroups'
import { api } from './lib/ipc'
import GroupList from './components/GroupList'
import HostEntryList from './components/HostEntryList'

export default function App() {
  const {
    groups,
    selectedGroup,
    selectedGroupId,
    setSelectedGroupId,
    loading,
    dirty,
    syncing,
    addGroup,
    updateGroup,
    deleteGroup,
    toggleGroup,
    addEntry,
    updateEntry,
    deleteEntry,
    sync
  } = useGroups()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-[#555577]">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">
        <div className="w-48 shrink-0 border-r border-[#2a2a4a]">
          <GroupList
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelect={setSelectedGroupId}
            onToggle={toggleGroup}
            onDelete={deleteGroup}
            onRename={updateGroup}
            onAdd={addGroup}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <HostEntryList
            group={selectedGroup}
            onAddEntry={addEntry}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
          />
        </div>
      </div>
      <div className="flex items-center px-3 py-1.5 border-t border-[#2a2a4a] bg-[#16162a]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${dirty ? 'bg-amber-400' : 'bg-emerald-400'}`}
          />
          <span className="text-[11px] text-[#8888aa]">
            {dirty ? '변경사항 있음' : '동기화됨'}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={sync}
            disabled={!dirty || syncing}
            className={`text-[11px] px-2.5 py-0.5 rounded transition-colors ${
              dirty && !syncing
                ? 'bg-[#6c6cf0] hover:bg-[#5a5ae0] text-white'
                : 'bg-[#2a2a4a] text-[#555577] cursor-default'
            }`}
          >
            {syncing ? '동기화 중...' : '동기화'}
          </button>
          <button
            onClick={() => api.quit()}
            className="text-[11px] px-2.5 py-0.5 rounded bg-[#2a2a4a] text-[#8888aa] hover:bg-[#3a2a3a] hover:text-[#ff6b6b] transition-colors"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  )
}
