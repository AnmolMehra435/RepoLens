import Report from '../models/Report.js'
import { getClonePath, cloneRepo } from './cloner.js'
import { runCloc } from './locRunner.js'
import { buildFileTree } from './fileTree.js'
import { detectStack } from './stackDetector.js'
import { generateDiagram } from './diagramGenerator.js'
import { generateSummary } from './summarizer.js'
import { scoreRepo } from './scorer.js'
import { cleanup } from './cleanup.js'

export async function processRepo(reportId, repoUrl) {
  const clonePath = getClonePath(reportId)

  try {
    await Report.findByIdAndUpdate(reportId, { status: 'processing' })
    await cloneRepo(repoUrl, clonePath)

    const [loc, fileTree, techStack] = await Promise.all([
      runCloc(clonePath),
      buildFileTree(clonePath),
      detectStack(clonePath),
    ])

    const repoName          = repoUrl.split('/').slice(-2).join('/')
    const summary           = await generateSummary(repoName, techStack, fileTree, loc)
    const scoring           = scoreRepo(techStack, fileTree, loc)
    const { mermaid, error} = await generateDiagram(fileTree, repoName, clonePath)

    await Report.findByIdAndUpdate(reportId, {
      status: 'complete',
      repoName,
      loc,
      fileTree,
      techStack,
      diagram: mermaid,
      summary,
      scoring,
    })

  } catch (err) {
    console.error(`Processing failed for ${reportId}:`, err.message)
    await Report.findByIdAndUpdate(reportId, {
      status: 'error',
      error: err.message,
    })
  } finally {
    cleanup(clonePath)
  }
}