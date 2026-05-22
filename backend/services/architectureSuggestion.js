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

export async function generateArchSuggestion(report) {
  const treeText  = flattenTree(report.fileTree).slice(0, 150).join('\n')
  const stackText = (report.techStack || []).join(', ')

  const prompt = `You are a senior software architect reviewing a project's folder structure.

Repository: ${report.repoName}
Tech Stack: ${stackText}
Summary: ${report.summary || 'Not available'}

Current folder structure:
${treeText}

Analyze the current structure and provide:

1. **Current Structure Analysis** — what's good, what's problematic, anti-patterns detected
2. **Optimized Folder Structure** — show the complete recommended structure using a tree format with comments explaining each folder's purpose
3. **Key Changes** — bullet list of specific changes and why each one improves the project
4. **Migration Steps** — numbered steps to migrate from current to optimized structure without breaking the project

Be specific to this tech stack (${stackText}). Follow industry best practices.
Use markdown formatting with headers, code blocks for the tree structure, and bullet points.
Return ONLY the markdown content, nothing else.`

  const response = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages:    [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens:  3000,
  })

  return response.choices[0].message.content.trim()
}