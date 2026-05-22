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

const FRAMEWORK_MAP = {
  // JS / TS
  react: 'React',
  next: 'Next.js',
  vue: 'Vue',
  nuxt: 'Nuxt',
  svelte: 'Svelte',
  express: 'Express',
  fastify: 'Fastify',
  '@nestjs/core': 'NestJS',
  mongoose: 'MongoDB',
  '@prisma/client': 'Prisma',
  prisma: 'Prisma',
  typeorm: 'TypeORM',
  tailwindcss: 'Tailwind CSS',
  typescript: 'TypeScript',
  'socket.io': 'Socket.IO',
  graphql: 'GraphQL',
  jest: 'Jest',
  vitest: 'Vitest',
  axios: 'Axios',
  redux: 'Redux',
  '@reduxjs/toolkit': 'Redux Toolkit',
  zustand: 'Zustand',
  vite: 'Vite',
  webpack: 'Webpack',
  pg: 'PostgreSQL',
  mysql2: 'MySQL',
  redis: 'Redis',
  ioredis: 'Redis',
  jsonwebtoken: 'JWT',
  passport: 'Passport',
  zod: 'Zod',
  'react-router-dom': 'React Router',
  '@tanstack/react-query':
    'React Query',
  three: 'Three.js',
  'framer-motion':
    'Framer Motion',

  // Python
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  pandas: 'Pandas',
  numpy: 'NumPy',
  tensorflow: 'TensorFlow',
  torch: 'PyTorch',

  // PHP
  laravel: 'Laravel',
  symfony: 'Symfony',

  // Java
  spring: 'Spring',
  'spring-boot':
    'Spring Boot',

  // Ruby
  rails: 'Ruby on Rails',
}

function walk(
  dirPath,
  found = [],
  depth = 0
) {
  if (depth > 5) return found

  let entries

  try {
    entries = fs.readdirSync(
      dirPath,
      {
        withFileTypes: true,
      }
    )
  } catch {
    return found
  }

  for (const entry of entries) {
    if (
      IGNORE.has(entry.name)
    )
      continue

    const fullPath = path.join(
      dirPath,
      entry.name
    )

    if (entry.isDirectory()) {
      walk(
        fullPath,
        found,
        depth + 1
      )
    } else {
      found.push(fullPath)
    }
  }

  return found
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(
      filePath,
      'utf-8'
    )
  } catch {
    return ''
  }
}

export function detectStack(
  clonePath
) {
  const stack = new Set()

  const files = walk(clonePath)

  // =====================
  // FILE EXTENSIONS
  // =====================

  for (const file of files) {
    const ext =
      path.extname(file)

    switch (ext) {
      case '.js':
      case '.jsx':
        stack.add('JavaScript')
        break

      case '.ts':
      case '.tsx':
        stack.add('TypeScript')
        break

      case '.py':
        stack.add('Python')
        break

      case '.java':
        stack.add('Java')
        break

      case '.php':
        stack.add('PHP')
        break

      case '.rb':
        stack.add('Ruby')
        break

      case '.go':
        stack.add('Go')
        break

      case '.rs':
        stack.add('Rust')
        break

      case '.html':
        stack.add('HTML')
        break

      case '.css':
        stack.add('CSS')
        break

      case '.scss':
        stack.add('SCSS')
        break

      case '.sql':
        stack.add('SQL')
        break

      case '.kt':
        stack.add('Kotlin')
        break

      case '.swift':
        stack.add('Swift')
        break

      case '.c':
        stack.add('C')
        break

      case '.cpp':
        stack.add('C++')
        break
    }
  }

  // =====================
  // PACKAGE.JSON
  // =====================

  const packageFiles =
    files.filter(file =>
      file.endsWith(
        'package.json'
      )
    )

  for (const pkgPath of packageFiles) {
    try {
      const pkg = JSON.parse(
        safeRead(pkgPath)
      )

      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      }

      for (const [
        key,
        label,
      ] of Object.entries(
        FRAMEWORK_MAP
      )) {
        if (deps[key]) {
          stack.add(label)
        }
      }
    } catch {}
  }

  // =====================
  // PYTHON
  // =====================

  const requirements =
    files.find(file =>
      file.endsWith(
        'requirements.txt'
      )
    )

  if (requirements) {
    stack.add('Python')

    const content =
      safeRead(requirements)

    for (const [
      key,
      label,
    ] of Object.entries(
      FRAMEWORK_MAP
    )) {
      if (
        content.includes(key)
      ) {
        stack.add(label)
      }
    }
  }

  // =====================
  // JAVA
  // =====================

  const pom = files.find(file =>
    file.endsWith('pom.xml')
  )

  if (pom) {
    stack.add('Java')

    const content =
      safeRead(pom)

    if (
      content.includes(
        'spring-boot'
      )
    ) {
      stack.add(
        'Spring Boot'
      )
    }

    if (
      content.includes(
        'hibernate'
      )
    ) {
      stack.add(
        'Hibernate'
      )
    }
  }

  // =====================
  // PHP
  // =====================

  const composer =
    files.find(file =>
      file.endsWith(
        'composer.json'
      )
    )

  if (composer) {
    stack.add('PHP')

    const content =
      safeRead(composer)

    if (
      content.includes(
        'laravel'
      )
    ) {
      stack.add('Laravel')
    }

    if (
      content.includes(
        'symfony'
      )
    ) {
      stack.add('Symfony')
    }
  }

  // =====================
  // RUBY
  // =====================

  const gemfile = files.find(
    file =>
      path.basename(file) ===
      'Gemfile'
  )

  if (gemfile) {
    stack.add('Ruby')

    const content =
      safeRead(gemfile)

    if (
      content.includes(
        'rails'
      )
    ) {
      stack.add(
        'Ruby on Rails'
      )
    }
  }

  // =====================
  // INFRA
  // =====================

  if (
    files.some(file =>
      file.endsWith(
        'Dockerfile'
      )
    )
  ) {
    stack.add('Docker')
  }

  if (
    files.some(file =>
      file.includes(
        'docker-compose'
      )
    )
  ) {
    stack.add(
      'Docker Compose'
    )
  }

  if (
    files.some(file =>
      file.endsWith(
        '.github/workflows'
      )
    )
  ) {
    stack.add(
      'GitHub Actions'
    )
  }

  // =====================
  // DATABASES
  // =====================

  const joined =
    files.join(' ')

  if (
    joined.includes(
      'postgres'
    )
  ) {
    stack.add(
      'PostgreSQL'
    )
  }

  if (
    joined.includes('mysql')
  ) {
    stack.add('MySQL')
  }

  if (
    joined.includes('redis')
  ) {
    stack.add('Redis')
  }

  return [...stack]
}