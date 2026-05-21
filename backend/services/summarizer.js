import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

function flattenTree(tree, prefix = '', lines = []) {

  for (const [name, value] of Object.entries(tree || {})) {

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

export async function generateSummary(
  repoName,
  techStack,
  fileTree,
  loc
) {

  try {

    const stack = techStack || []

    const primaryLang = loc
      ? Object.entries(loc)
          .sort((a, b) => b[1].code - a[1].code)[0]?.[0]
      : 'Unknown'

    const treeText = flattenTree(fileTree)
      .slice(0, 120)
      .join('\n')

    const prompt = `
You are a senior software architect.

Analyze this repository and generate a professional project summary.

Rules:
- Keep the summary between 120-200 words
- Write in a professional and technical tone
- Explain:
  - what the project does
  - architecture style
  - frontend/backend structure
  - database usage
  - authentication patterns
  - notable engineering decisions
  - deployment/devops clues if visible
- Mention important technologies naturally
- DO NOT hallucinate technologies not present
- Return ONLY the summary text

Repository Name:
${repoName}

Primary Language:
${primaryLang}

Detected Tech Stack:
${stack.join(', ')}

File Tree:
${treeText}
`

    const completion = await groq.chat.completions.create({

      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 0.2,
    })

    const summary =
      completion.choices[0]?.message?.content?.trim()

    if (!summary) {
      return `${repoName} is a software project built using ${stack.join(', ')}.`
    }

    return summary

  } catch (err) {

    console.error('Groq summary error:', err)

    return `${repoName} is a software project built using ${techStack?.join(', ') || 'modern technologies'}.`
  }
}
