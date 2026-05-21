import fs from 'fs'

export function cleanup(clonePath) {
  try {
    fs.rmSync(clonePath, { recursive: true, force: true })
    console.log(`Cleaned up ${clonePath}`)
  } catch (err) {
    console.error(`Cleanup failed for ${clonePath}:`, err.message)
  }
}