import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

function getReadme(clonePath) {

  const names = [
    'README.md',
    'readme.md',
    'README.txt',
    'README',
  ]

  for (const name of names) {

    const p = path.join(clonePath, name)

    if (fs.existsSync(p)) {

      try {

        const content = fs.readFileSync(p, 'utf-8')

        return content.slice(0, 1500)

      } catch {

        return ''
      }
    }
  }

  return ''
}

function flattenTree(tree, prefix = '', lines = []) {

  for (const [name, value] of Object.entries(tree)) {

    if (
      name === 'node_modules' ||
      name === '.git' ||
      name === 'dist' ||
      name === 'build' ||
      name === '.next'
    ) {
      continue
    }

    lines.push(prefix + name)

    if (value && typeof value === 'object') {
      flattenTree(value, prefix + '  ', lines)
    }
  }

  return lines
}

function cleanMermaid(mermaid) {

  return mermaid

    .replace(/^```mermaid\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')

    // remove weird unicode
    .replace(/[^\x00-\x7F]/g, '')

    // normalize tabs
    .replace(/\t/g, '  ')

    // remove broken subgraph syntax
    .replace(/subgraph\s+([^\n\[]+)\s*\[/gi, 'subgraph $1')

    // remove lonely ]
    .replace(/^\s*\]\s*$/gm, '')

    // remove duplicate blank lines
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim())
    .join('\n')
}

function sanitizeMermaid(mermaid) {

  const lines = mermaid.split('\n')

  const sanitized = lines.map(line => {

    line = line.replace(
      /([A-Za-z0-9./\\_-]+)\[/g,
      (_, id) => {

        const cleanId = id
          .replace(/[^A-Za-z0-9]/g, '_')

        return `${cleanId}[`
      }
    )

    line = line.replace(
      /([A-Za-z0-9./\\_-]+)\s*-->/g,
      (_, id) => {

        const cleanId = id
          .replace(/[^A-Za-z0-9]/g, '_')

        return `${cleanId} -->`
      }
    )

    line = line.replace(
      /-->\s*([A-Za-z0-9./\\_-]+)/g,
      (_, id) => {

        const cleanId = id
          .replace(/[^A-Za-z0-9]/g, '_')

        return `--> ${cleanId}`
      }
    )

    return line
  })

  return sanitized.join('\n')
}

function validateMermaid(mermaid) {

  if (!mermaid.startsWith('flowchart')) {
    return false
  }

  const invalidPatterns = [
    /subgraph\s+.*\[/i,
    /\]\s*\]/,
    /\[\s*\[/,
  ]

  for (const pattern of invalidPatterns) {

    if (pattern.test(mermaid)) {
      return false
    }
  }

  return true
}

function createFallbackDiagram(repoName) {

  return `
flowchart TD

  A[${repoName}]
  B[Source Code]
  C[Components]
  D[API Layer]
  E[Database]

  A --> B
  B --> C
  C --> D
  D --> E
`
}

export async function generateDiagram(
  fileTree,
  repoName,
  clonePath
) {

  try {

    if (!process.env.GROQ_API_KEY) {

      return {
        mermaid: createFallbackDiagram(repoName),
        error: 'No Groq API key configured',
      }
    }

    const readme = getReadme(clonePath)

    const treeText = flattenTree(fileTree)
      .slice(0, 80)
      .join('\n')

    const prompt = `
You are a senior software architect.

Generate a VALID Mermaid architecture diagram.

STRICT RULES:

- Return ONLY Mermaid code
- Start with: flowchart TD
- NEVER return markdown
- NEVER use triple backticks
- NEVER use square brackets after subgraph
- NEVER use dots/spaces/slashes in node IDs

VALID:

index_js[index.js]

INVALID:

index.js[index.js]

VALID SUBGRAPH:

subgraph Backend
  app_js[app.js]
  router_js[router.js]

  app_js --> router_js
end

Requirements:

- Maximum 25 important nodes
- Ignore test/build/generated files
- Show architecture flow
- Use concise labels
- Use clean Mermaid syntax only

Repository:
${repoName}

File Tree:
${treeText}

${readme ? `README:\n${readme}` : ''}
`

    const completion =
      await groq.chat.completions.create({

        model: 'llama-3.3-70b-versatile',

        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],

        temperature: 0.1,
      })

    let mermaid =
      completion.choices[0]?.message?.content || ''

    mermaid = cleanMermaid(mermaid)

    mermaid = sanitizeMermaid(mermaid)

    console.log('\nGenerated Mermaid:\n')
    console.log(mermaid)

    if (!validateMermaid(mermaid)) {

      console.log('\nInvalid Mermaid detected.\n')

      return {
        mermaid: createFallbackDiagram(repoName),
        error: 'AI generated invalid Mermaid syntax',
      }
    }

    return {
      mermaid,
      error: null,
    }

  } catch (err) {

    console.error('\nGroq error:\n', err)

    return {
      mermaid: createFallbackDiagram(repoName),
      error: err.message || 'Diagram generation failed',
    }
  }
}