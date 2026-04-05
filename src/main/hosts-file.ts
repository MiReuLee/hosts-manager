import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import sudoPrompt from '@vscode/sudo-prompt'
import type { HostGroup } from './store'

const HOSTS_PATH = '/etc/hosts'
const MARKER_START = '# === Hosts Manager Start ==='
const MARKER_END = '# === Hosts Manager End ==='

export function readHostsFile(): string {
  return fs.readFileSync(HOSTS_PATH, 'utf-8')
}

export function generateManagedSection(groups: HostGroup[]): string {
  if (groups.length === 0) return ''

  const lines: string[] = [MARKER_START]

  for (const group of groups) {
    lines.push('')
    if (group.enabled) {
      lines.push(`# [Group: ${group.name}]`)
      for (const entry of group.entries) {
        lines.push(`${entry.ip}  ${entry.hostname}`)
      }
    } else {
      lines.push(`# [Group: ${group.name}] (disabled)`)
      for (const entry of group.entries) {
        lines.push(`# ${entry.ip}  ${entry.hostname}`)
      }
    }
  }

  lines.push('')
  lines.push(MARKER_END)
  return lines.join('\n')
}

export function mergeWithHostsFile(
  existingContent: string,
  managedSection: string
): string {
  const startIdx = existingContent.indexOf(MARKER_START)
  const endIdx = existingContent.indexOf(MARKER_END)

  if (startIdx !== -1 && endIdx !== -1) {
    const before = existingContent.substring(0, startIdx).trimEnd()
    const after = existingContent.substring(endIdx + MARKER_END.length).trimStart()

    const parts = [before]
    if (managedSection) parts.push(managedSection)
    if (after) parts.push(after)
    return parts.join('\n\n') + '\n'
  }

  const trimmed = existingContent.trimEnd()
  if (!managedSection) return trimmed + '\n'
  return trimmed + '\n\n' + managedSection + '\n'
}

export function writeHostsFile(content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tmpPath = path.join(app.getPath('temp'), 'hosts-manager-tmp')
    fs.writeFileSync(tmpPath, content, 'utf-8')

    sudoPrompt.exec(
      `cp "${tmpPath}" /etc/hosts && chmod 644 /etc/hosts`,
      { name: 'Hosts Manager' },
      (error) => {
        try {
          fs.unlinkSync(tmpPath)
        } catch {}
        if (error) reject(error)
        else resolve()
      }
    )
  })
}

export function syncGroupsToHostsFile(groups: HostGroup[]): Promise<void> {
  const existing = readHostsFile()
  const managed = generateManagedSection(groups)
  const merged = mergeWithHostsFile(existing, managed)
  return writeHostsFile(merged)
}
