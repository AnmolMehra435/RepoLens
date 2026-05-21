export function scoreRepo(techStack, fileTree, loc) {
  const stack   = techStack || []
  const folders = fileTree
    ? Object.keys(fileTree).map(k => k.replace('/', '').toLowerCase())
    : []

  const scores  = []
  let total     = 0

  function add(category, label, points, passed) {
    const earned = passed ? points : 0
    total += earned
    scores.push({ category, label, points, earned, passed })
  }

  // Documentation (25pts)
  const hasReadme = folders.some(f => ['readme.md', 'readme', 'readme.txt'].includes(f)) ||
    (fileTree && Object.keys(fileTree).some(k => k.toLowerCase().startsWith('readme')))
  add('Documentation', 'README file present',    15, hasReadme)
  add('Documentation', 'TypeScript used',         10, stack.includes('TypeScript'))

  // Structure (30pts)
  const hasTests = folders.some(f =>
    ['test', 'tests', '__tests__', 'spec', 'specs'].includes(f)
  )
  const hasSrc = folders.includes('src')
  const hasModels = folders.some(f => ['models', 'model'].includes(f))
  const hasRoutes = folders.some(f => ['routes', 'route'].includes(f))
  add('Structure', 'Tests folder present',       15, hasTests)
  add('Structure', 'src/ directory used',         8, hasSrc)
  add('Structure', 'Defined models layer',         7, hasModels)

  // DevOps (20pts)
  const hasDocker    = stack.includes('Docker')
  const hasEnvExample = fileTree &&
    Object.keys(fileTree).some(k => k.toLowerCase().includes('.env.example'))
  add('DevOps', 'Docker configured',             12, hasDocker)
  add('DevOps', '.env.example present',           8, hasEnvExample)

  // Complexity (25pts — deductions)
  const totalFiles = loc
    ? Object.values(loc).reduce((s, v) => s + v.nFiles, 0)
    : 0
  const totalLoc = loc
    ? Object.values(loc).reduce((s, v) => s + v.code, 0)
    : 0
  const avgLocPerFile = totalFiles > 0 ? totalLoc / totalFiles : 0

  const notHuge     = avgLocPerFile < 300
  const notMonolith = totalLoc < 50000
  const hasRoutesSep = hasRoutes

  add('Complexity', 'Avg file size reasonable',  10, notHuge)
  add('Complexity', 'Codebase not monolithic',   10, notMonolith)
  add('Complexity', 'Routes separated',           5, hasRoutesSep)

  const finalScore = Math.min(100, Math.max(0, total))

  let grade, label
  if (finalScore >= 85)      { grade = 'A'; label = 'Excellent' }
  else if (finalScore >= 70) { grade = 'B'; label = 'Good' }
  else if (finalScore >= 55) { grade = 'C'; label = 'Fair' }
  else if (finalScore >= 40) { grade = 'D'; label = 'Needs work' }
  else                       { grade = 'F'; label = 'Poor' }

  return { score: finalScore, grade, label, breakdown: scores }
}