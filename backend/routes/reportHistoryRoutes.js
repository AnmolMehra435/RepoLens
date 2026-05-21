import express from 'express'

import Report from '../models/Report.js'

import {
  protect,
} from '../middleware/authMiddleware.js'

const router = express.Router()

router.get(
  '/history',

  protect,

  async (req, res) => {
    try {
      const reports =
        await Report.find({
          user: req.user._id,
        })

          .sort({
            createdAt: -1,
          })

          .select(
            'repoName repoUrl scoring createdAt'
          )

      res.json(reports)
    } catch (err) {
      res.status(500).json({
        message:
          'Failed to fetch history',
      })
    }
  }
)

export default router