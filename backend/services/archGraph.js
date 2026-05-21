import fs from 'fs'
import path from 'path'

const IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build',
  'coverage', '.next', '.cache', 'out'
])

const SUPPORTED = new Set(['.js', '.jsx', '.ts', '.tsx'])

function getAllFiles(dirPath, files = []) {
  let entries
  try { entries = fs.readdirSync(dirPath, { withFileTypes: true }) }
  catch { return files }

  for (const entry of entries) {
    if (IGNORE.has(entry.name) || entry.name.startsWith('.')) continue
    const full = path.join(dirPath, entry.name)
    if (entry.isDirectory()) getAllFiles(full, files)
    else if (SUPPORTED.has(path.extname(entry.name))) files.push(full)
  }
  return files
}

function extractImports(filePath) {
  let content
  try { content = fs.readFileSync(filePath, 'utf-8') }
  catch { return [] }

  const imports = []
  const patterns = [
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const dep = match[1]
      if (dep.startsWith('.')) imports.push(dep)
    }
  }
  return imports
}

function resolveFolder(filePath, importPath, rootPath) {
  try {
    const dir = path.dirname(filePath)
    const resolved = path.resolve(dir, importPath)
    const rel = path.relative(rootPath, resolved)
    const parts = rel.split(path.sep)
    return parts.length > 1 ? parts[0] : '.'
  } catch {
    return null
  }
}

function getFileFolder(filePath, rootPath) {
  const rel = path.relative(rootPath, filePath)
  const parts = rel.split(path.sep)
  return parts.length > 1 ? parts[0] : '.'
}

export function buildArchGraph(clonePath) {
  const files = getAllFiles(clonePath)
  const edgeSet = new Set()
  const folderSet = new Set()

  for (const file of files) {
    const sourceFolder = getFileFolder(file, clonePath)
    folderSet.add(sourceFolder)

    const imports = extractImports(file)
    for (const imp of imports) {
      const targetFolder = resolveFolder(file, imp, clonePath)
      if (!targetFolder || targetFolder === sourceFolder) continue

      folderSet.add(targetFolder)
      const edgeKey = `${sourceFolder}→${targetFolder}`
      edgeSet.add(edgeKey)
    }
  }

  const folders = [...folderSet].filter(f => f !== '.')

  const nodes = folders.map((folder, i) => ({
    id: folder,
    label: folder,
    position: {
      x: 150 + (i % 4) * 200,
      y: 100 + Math.floor(i / 4) * 160,
    }
  }))

  const edges = [...edgeSet]
    .map(key => {
      const [source, target] = key.split('→')
      if (!folders.includes(source) || !folders.includes(target)) return null
      return {
        id: `${source}-${target}`,
        source,
        target,
      }
    })
    .filter(Boolean)

  return { nodes, edges }
}