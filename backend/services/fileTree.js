import fs from 'fs'
import path from 'path'

const IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build',
  'coverage', '.next', '.cache', 'out'
])

export function buildFileTree(dirPath, depth = 0) {
  if (depth > 6) return null

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const tree = {}

  for (const entry of entries) {
    if (IGNORE.has(entry.name) || entry.name.startsWith('.')) continue

    if (entry.isDirectory()) {
      const subtree = buildFileTree(path.join(dirPath, entry.name), depth + 1)
      if (subtree !== null) tree[entry.name + '/'] = subtree
    } else {
      tree[entry.name] = null
    }
  }

  return tree
}