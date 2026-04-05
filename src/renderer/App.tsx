import { useGroups } from './hooks/useGroups'
import GroupList from './components/GroupList'
import HostEntryList from './components/HostEntryList'

export default function App() {
  const {
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
  } = useGroups()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-[#555577]">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      <div className="w-48 flex-shrink-0 border-r border-[#2a2a4a]">
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
  )
}
