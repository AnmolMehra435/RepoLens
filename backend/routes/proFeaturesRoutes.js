import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import Report from '../models/Report.js'
import { generateReadme } from '../services/readmeGenerator.js'
import { generateArchSuggestion } from '../services/architectureSuggestion.js'

const router = express.Router()

function requirePro(req, res, next) {
  if (req.user.plan !== 'pro' && req.user.plan !== 'max') {
    return res.status(403).json({
      message: 'Pro plan required',
      upgrade: true,
    })
  }
  next()
}

// POST /api/pro/readme/:reportId
router.post('/readme/:reportId', protect, requirePro, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
    if (!report) return res.status(404).json({ message: 'Report not found' })

    const readme = await generateReadme(report)
    res.json({ readme })
  } catch (err) {
    console.error('README generation error:', err.message)
    res.status(500).json({ message: 'Failed to generate README' })
  }
})

// POST /api/pro/architecture/:reportId
router.post('/architecture/:reportId', protect, requirePro, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
    if (!report) return res.status(404).json({ message: 'Report not found' })

    const suggestion = await generateArchSuggestion(report)
    res.json({ suggestion })
  } catch (err) {
    console.error('Architecture suggestion error:', err.message)
    res.status(500).json({ message: 'Failed to generate suggestion' })
  }
})

export default router