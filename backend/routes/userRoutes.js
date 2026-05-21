import express from 'express'

import jwt from 'jsonwebtoken'

import User from '../models/User.js'

const router = express.Router()

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res
        .status(401)
        .json({
          message:
            'Not authenticated',
        })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user =
      await User.findById(decoded.id)

    if (!user) {
      return res
        .status(404)
        .json({
          message:
            'User not found',
        })
    }

    res.json({
      id: user._id,

      name: user.name,

      email: user.email,

      avatar: user.avatar,

      provider: user.provider,
    })
  } catch (err) {
    res.status(401).json({
      message: 'Invalid token',
    })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')

req.logout?.(() => {})

res.json({
  message: 'Logged out',
})
})

export default router