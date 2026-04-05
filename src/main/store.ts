import fs from 'fs'
import path from 'path'
import { app } from 'electron'

interface HostEntry {
  id: string
  ip: string
  hostname: string
}

interface HostGroup {
  id: string
  name: string
  enabled: boolean
  entries: HostEntry[]
}

interface AppState {
  groups: HostGroup[]
  version: number
}

const defaults: AppState = {
  groups: [],
  version: 1
}

function getStorePath(): string {
  return path.join(app.getPath('userData'), 'hosts-manager.json')
}

function readState(): AppState {
  try {
    const data = fs.readFileSync(getStorePath(), 'utf-8')
    return { ...defaults, ...JSON.parse(data) }
  } catch {
    return { ...defaults }
  }
}

function writeState(state: AppState): void {
  const dir = path.dirname(getStorePath())
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(getStorePath(), JSON.stringify(state, null, 2), 'utf-8')
}

export function getGroups(): HostGroup[] {
  return readState().groups
}

export function setGroups(groups: HostGroup[]): void {
  const state = readState()
  state.groups = groups
  writeState(state)
}

export type { HostEntry, HostGroup, AppState }
