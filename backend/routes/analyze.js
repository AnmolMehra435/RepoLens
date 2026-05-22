import express from 'express'

import Report from '../models/Report.js'

import { processRepo }
from '../services/analyzer.js'

import {
  protect,
} from '../middleware/authMiddleware.js'

import {
  checkUsageLimit,
} from '../middleware/usageLimit.js'

const router = express.Router()

router.post(
  '/analyze',

  protect,

  checkUsageLimit,

  async (req, res) => {
    const { repoUrl } = req.body

    if (
      !repoUrl ||
      !repoUrl.match(
        /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/
      )
    ) {
      return res.status(400).json({
        error: 'Invalid GitHub URL',
      })
    }

    const report =
      await Report.create({
        repoUrl,

        status: 'processing',

        user: req.user._id,
      })

    res.json({
      reportId: report._id,

      status: 'processing',
    })

    processRepo(
      report._id,
      repoUrl
    ).catch(console.error)
  }
)



router.get(
  '/report/:id',

  async (req, res) => {
    const report =
      await Report.findById(
        req.params.id
      )

    if (!report) {
      return res.status(404).json({
        error:
          'Report not found',
      })
    }

    res.json(report)
  }
)

export default router