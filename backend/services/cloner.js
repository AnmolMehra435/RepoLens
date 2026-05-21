import simpleGit from 'simple-git'
import path from 'path'
import os from 'os'

export function getClonePath(reportId) {
  return path.join(os.tmpdir(), `gitinsight-${reportId}`)
}

export async function cloneRepo(repoUrl, clonePath) {
  const git = simpleGit()
  await git.clone(repoUrl, clonePath, [
    '--depth', '1',
    '--single-branch',
  ])
}