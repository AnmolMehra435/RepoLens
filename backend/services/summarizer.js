export function generateSummary(repoName, techStack, fileTree, loc) {
  const stack = techStack || []
  const lines = []

  const hasReact    = stack.includes('React')
  const hasNext     = stack.includes('Next.js')
  const hasVue      = stack.includes('Vue')
  const hasSvelte   = stack.includes('Svelte')
  const hasExpress  = stack.includes('Express')
  const hasFastify  = stack.includes('Fastify')
  const hasNest     = stack.includes('NestJS')
  const hasMongo    = stack.includes('MongoDB')
  const hasPostgres = stack.includes('PostgreSQL')
  const hasMySQL    = stack.includes('MySQL')
  const hasTS       = stack.includes('TypeScript')
  const hasDocker   = stack.includes('Docker')
  const hasPrisma   = stack.includes('Prisma')
  const hasGraphQL  = stack.includes('GraphQL')
  const hasJWT      = stack.includes('JWT')
  const hasPython   = stack.includes('Python')
  const hasGo       = stack.includes('Go')
  const hasRust     = stack.includes('Rust')

  const folders = fileTree ? Object.keys(fileTree).map(k => k.replace('/', '').toLowerCase()) : []
  const hasModels      = folders.some(f => f === 'models' || f === 'model')
  const hasControllers = folders.some(f => f === 'controllers' || f === 'controller')
  const hasRoutes      = folders.some(f => f === 'routes' || f === 'route')
  const hasServices    = folders.some(f => f === 'services' || f === 'service')
  const hasMiddleware  = folders.some(f => f === 'middleware' || f === 'middlewares')
  const hasComponents  = folders.some(f => f === 'components')
  const hasPages       = folders.some(f => f === 'pages')
  const hasTests       = folders.some(f => ['test', 'tests', '__tests__', 'spec'].includes(f))
  const hasFrontend    = folders.some(f => f === 'frontend' || f === 'client')
  const hasBackend     = folders.some(f => f === 'backend' || f === 'server')

  const isMVC = hasModels && hasControllers && hasRoutes
  const isMERN = hasReact && hasExpress && hasMongo
  const isFullstack = hasFrontend && hasBackend
  const isMonorepo = isFullstack

  const primaryLang = loc
    ? Object.entries(loc).sort((a, b) => b[1].code - a[1].code)[0]?.[0]
    : null

  // Opening line
  if (isMERN) {
    lines.push(`${repoName} is a fullstack MERN application built with React, Express, and MongoDB.`)
  } else if (hasNext && hasMongo) {
    lines.push(`${repoName} is a fullstack Next.js application with MongoDB persistence.`)
  } else if (hasNext) {
    lines.push(`${repoName} is a Next.js application.`)
  } else if (hasReact && (hasExpress || hasFastify || hasNest)) {
    lines.push(`${repoName} is a fullstack JavaScript application with a React frontend and ${hasNest ? 'NestJS' : hasFastify ? 'Fastify' : 'Express'} backend.`)
  } else if (hasReact) {
    lines.push(`${repoName} is a React frontend application.`)
  } else if (hasVue) {
    lines.push(`${repoName} is a Vue.js application.`)
  } else if (hasSvelte) {
    lines.push(`${repoName} is a Svelte application.`)
  } else if (hasExpress || hasFastify || hasNest) {
    lines.push(`${repoName} is a ${hasNest ? 'NestJS' : hasFastify ? 'Fastify' : 'Express'} backend API.`)
  } else if (hasPython) {
    lines.push(`${repoName} is a Python project.`)
  } else if (hasGo) {
    lines.push(`${repoName} is a Go project.`)
  } else if (hasRust) {
    lines.push(`${repoName} is a Rust project.`)
  } else if (primaryLang) {
    lines.push(`${repoName} is a ${primaryLang} project.`)
  } else {
    lines.push(`${repoName} is a software project.`)
  }

  // Architecture pattern
  if (isMonorepo) {
    lines.push('It uses a monorepo structure with separate frontend and backend workspaces.')
  }
  if (isMVC) {
    lines.push('The backend follows an MVC architecture with models, controllers, and routes.')
  } else if (hasServices && hasRoutes) {
    lines.push('The backend is organized with a routes → services layered pattern.')
  }

  // Database
  if (hasPrisma && hasPostgres) lines.push('Data is managed with Prisma ORM and PostgreSQL.')
  else if (hasPrisma) lines.push('Data is managed with Prisma ORM.')
  else if (hasMongo) lines.push('MongoDB is used for data persistence.')
  else if (hasPostgres) lines.push('PostgreSQL is used for data persistence.')
  else if (hasMySQL) lines.push('MySQL is used for data persistence.')

  // Notable features
  const features = []
  if (hasTS) features.push('TypeScript')
  if (hasDocker) features.push('Docker')
  if (hasGraphQL) features.push('GraphQL API')
  if (hasJWT) features.push('JWT authentication')
  if (hasMiddleware) features.push('custom middleware')
  if (hasTests) features.push('test suite')

  if (features.length > 0) {
    lines.push(`Notable features include ${features.join(', ')}.`)
  }

  return lines.join(' ')
}