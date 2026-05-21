import fs from 'fs'
import path from 'path'

const IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build',
  'coverage', '.next', '.cache', 'out'
])

const EXT_MAP = {
  '.js':   'JavaScript',
  '.jsx':  'JavaScript',
  '.ts':   'TypeScript',
  '.tsx':  'TypeScript',
  '.py':   'Python',
  '.go':   'Go',
  '.rs':   'Rust',
  '.java': 'Java',
  '.cpp':  'C++',
  '.c':    'C',
  '.cs':   'C#',
  '.rb':   'Ruby',
  '.php':  'PHP',
  '.html': 'HTML',
  '.css':  'CSS',
  '.scss': 'SCSS',
  '.json': 'JSON',
  '.md':   'Markdown',
  '.yml':  'YAML',
  '.yaml': 'YAML',
  '.sh':   'Shell',
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    let code = 0, blank = 0, comment = 0

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        blank++
      } else if (
        trimmed.startsWith('//') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('<!--')
      ) {
        comment++
      } else {
        code++
      }
    }

    return { code, blank, comment }
  } catch {
    return { code: 0, blank: 0, comment: 0 }
  }
}

function walkDir(dirPath, result = {}) {
  let entries
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true })
  } catch {
    return result
  }

  for (const entry of entries) {
    if (IGNORE.has(entry.name) || entry.name.startsWith('.')) continue

    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      walkDir(fullPath, result)
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      const lang = EXT_MAP[ext]
      if (!lang) continue

      const counts = countLines(fullPath)
      if (!result[lang]) {
        result[lang] = { code: 0, blank: 0, comment: 0, nFiles: 0 }
      }
      result[lang].code    += counts.code
      result[lang].blank   += counts.blank
      result[lang].comment += counts.comment
      result[lang].nFiles  += 1
    }
  }

  return result
}

export async function runCloc(clonePath) {
  return walkDir(clonePath)
}