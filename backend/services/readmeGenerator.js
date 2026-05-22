import { groq } from './groqClient.js'

function flattenTree(tree, prefix = '', lines = []) {
  for (const [name, value] of Object.entries(tree || {})) {
    lines.push(prefix + name)
    if (value && typeof value === 'object') {
      flattenTree(value, prefix + '  ', lines)
    }
  }
  return lines
}

export async function generateReadme(report) {
  const treeText  = flattenTree(report.fileTree).slice(0, 150).join('\n')
  const stackText = (report.techStack || []).join(', ')
  const locText   = Object.entries(report.loc || {})
    .map(([lang, d]) => `${lang}: ${d.code} lines`)
    .join(', ')

  const prompt = `You are a senior developer writing a professional README.md for a GitHub repository.

Repository: ${report.repoName}
URL: ${report.repoUrl}
Tech Stack: ${stackText}
Lines of Code: ${locText}
Summary: ${report.summary || 'Not available'}

File structure:
${treeText}

Generate a complete, professional README.md using proper GitHub markdown syntax. Include:
1. Project title with a brief tagline
2. Badges (build, license, version — use shields.io format)
3. Table of contents
4. About / Overview section
5. Features list (infer from tech stack and file structure)
6. Tech stack section with each technology
7. Project structure (use the file tree above)
8. Getting started (Prerequisites, Installation, Environment variables, Running the project)
9. API endpoints section (if backend detected)
10. Contributing guidelines
11. License section

Use proper markdown: headers, code blocks with language tags, bullet points, tables where appropriate.
Return ONLY the markdown content, nothing else.`

  const response = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages:    [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens:  4000,
  })

  return response.choices[0].message.content.trim()
}