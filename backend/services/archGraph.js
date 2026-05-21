import fs from 'fs'
import path from 'path'

const IGNORE = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.cache',
  'out',
])

const SUPPORTED = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
])

const MAX_NODES = 120

function getAllFiles(dirPath, files = []) {
  let entries

  try {
    entries = fs.readdirSync(dirPath, {
      withFileTypes: true,
    })
  } catch {
    return files
  }

  for (const entry of entries) {
    if (
      IGNORE.has(entry.name) ||
      entry.name.startsWith('.')
    ) {
      continue
    }

    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      getAllFiles(fullPath, files)
    } else if (
      SUPPORTED.has(path.extname(entry.name))
    ) {
      files.push(fullPath)
    }
  }

  return files
}

function extractImports(filePath) {
  let content

  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return []
  }

  const imports = []

  const patterns = [
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    let match

    while ((match = pattern.exec(content)) !== null) {
      const dependency = match[1]

      if (dependency.startsWith('.')) {
        imports.push(dependency)
      }
    }
  }

  return imports
}

function resolveImport(
  filePath,
  importPath,
  rootPath
) {
  try {
    const currentDir = path.dirname(filePath)

    let resolved = path.resolve(
      currentDir,
      importPath
    )

    const possiblePaths = [
      '',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '/index.js',
      '/index.ts',
      '/index.jsx',
      '/index.tsx',
    ]

    for (const ext of possiblePaths) {
      const full = resolved + ext

      if (fs.existsSync(full)) {
        resolved = full
        break
      }
    }

    return path
      .relative(rootPath, resolved)
      .replace(/\\/g, '/')
  } catch {
    return null
  }
}

function getFileNode(filePath, rootPath) {
  return path
    .relative(rootPath, filePath)
    .replace(/\\/g, '/')
}

function getFolderNode(filePath, rootPath) {
  const relative = path.relative(
    rootPath,
    filePath
  )

  const parts = relative.split(path.sep)

  if (parts.length <= 1) {
    return '.'
  }

  return parts.slice(0, -1).join('/')
}

function createNodes(nodeSet) {
  return [...nodeSet]
    .slice(0, MAX_NODES)
    .map((node, index) => ({
      id: node,
      data: {
        label:
          node.length > 30
            ? '...' + node.slice(-27)
            : node,
      },
      position: {
        x: (index % 5) * 280,
        y: Math.floor(index / 5) * 180,
      },
    }))
}

function createEdges(edgeSet, allowedNodes) {
  return [...edgeSet]
    .map(edge => {
      const [source, target] = edge.split('→')

      if (
        !allowedNodes.has(source) ||
        !allowedNodes.has(target)
      ) {
        return null
      }

      return {
        id: `${source}-${target}`,
        source,
        target,
        animated: false,
      }
    })
    .filter(Boolean)
}

export function buildArchGraph(
  clonePath,
  mode = 'folder'
) {
  const files = getAllFiles(clonePath)

  const nodeSet = new Set()
  const edgeSet = new Set()

  for (const file of files) {
    const source =
      mode === 'file'
        ? getFileNode(file, clonePath)
        : getFolderNode(file, clonePath)

    if (!source || source === '.') continue

    nodeSet.add(source)

    const imports = extractImports(file)

    for (const imp of imports) {
      const resolved = resolveImport(
        file,
        imp,
        clonePath
      )

      if (!resolved) continue

      const target =
        mode === 'file'
          ? resolved
          : getFolderNode(
              path.join(clonePath, resolved),
              clonePath
            )

      if (
        !target ||
        target === source ||
        target === '.'
      ) {
        continue
      }

      nodeSet.add(target)

      edgeSet.add(`${source}→${target}`)
    }
  }

  const limitedNodes = new Set(
    [...nodeSet].slice(0, MAX_NODES)
  )

  return {
    mode,
    nodes: createNodes(limitedNodes),
    edges: createEdges(edgeSet, limitedNodes),
    totalNodes: nodeSet.size,
    totalEdges: edgeSet.size,
  }
}