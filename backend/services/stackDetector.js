import fs from 'fs'
import path from 'path'

const FRAMEWORK_MAP = {
  'react':              'React',
  'next':               'Next.js',
  'vue':                'Vue',
  'nuxt':               'Nuxt',
  'svelte':             'Svelte',
  'express':            'Express',
  'fastify':            'Fastify',
  '@nestjs/core':       'NestJS',
  'mongoose':           'MongoDB',
  '@prisma/client':     'Prisma',
  'prisma':             'Prisma',
  'typeorm':            'TypeORM',
  'tailwindcss':        'Tailwind CSS',
  'typescript':         'TypeScript',
  'socket.io':          'Socket.IO',
  'graphql':            'GraphQL',
  'jest':               'Jest',
  'vitest':             'Vitest',
  'axios':              'Axios',
  'redux':              'Redux',
  '@reduxjs/toolkit':   'Redux',
  'zustand':            'Zustand',
  'vite':               'Vite',
  'webpack':            'Webpack',
  'postgres':           'PostgreSQL',
  'pg':                 'PostgreSQL',
  'mysql2':             'MySQL',
  'redis':              'Redis',
  'ioredis':            'Redis',
  'jsonwebtoken':       'JWT',
  'passport':           'Passport',
  'zod':                'Zod',
  'react-router-dom':   'React Router',
  'react-query':        'React Query',
  '@tanstack/react-query': 'React Query',
  'three':              'Three.js',
  'framer-motion':      'Framer Motion',
}

const IGNORE = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next'
])

function findPackageJsonFiles(dirPath, found = [], depth = 0) {
  if (depth > 4) return found

  let entries
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true })
  } catch {
    return found
  }

  for (const entry of entries) {
    if (IGNORE.has(entry.name)) continue

    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      findPackageJsonFiles(fullPath, found, depth + 1)
    } else if (entry.name === 'package.json') {
      found.push(fullPath)
    }
  }

  return found
}

export function detectStack(clonePath) {
  const stack = new Set()

  const pkgFiles = findPackageJsonFiles(clonePath)

  for (const pkgPath of pkgFiles) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      }

      for (const [key, label] of Object.entries(FRAMEWORK_MAP)) {
        if (deps[key]) stack.add(label)
      }

      if (deps['typescript']) stack.add('TypeScript')

    } catch {
      continue
    }
  }

  if (fs.existsSync(path.join(clonePath, 'Dockerfile'))) stack.add('Docker')
  if (fs.existsSync(path.join(clonePath, 'docker-compose.yml'))) stack.add('Docker')
  if (fs.existsSync(path.join(clonePath, 'requirements.txt'))) stack.add('Python')
  if (fs.existsSync(path.join(clonePath, 'go.mod'))) stack.add('Go')
  if (fs.existsSync(path.join(clonePath, 'Cargo.toml'))) stack.add('Rust')

  return [...stack]
}