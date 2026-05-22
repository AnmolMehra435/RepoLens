import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/me', protect, async (req, res) => {
  const user = req.user

  const today = new Date()
  const isNewDay =
    !user.lastAnalysisDate ||
    user.lastAnalysisDate.toDateString() !== today.toDateString()

  if (isNewDay) {
    user.dailyAnalysisCount = 0
    user.lastAnalysisDate   = today
    await user.save()
  }

  res.json({
    _id:                user._id,
    name:               user.name,
    email:              user.email,
    avatar:             user.avatar,
    plan:               user.plan,
    dailyAnalysisCount: user.dailyAnalysisCount,
    lastAnalysisDate:   user.lastAnalysisDate,
  })
})

router.post('/logout', protect, (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

export default router