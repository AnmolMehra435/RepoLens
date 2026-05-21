import express from 'express'

import passport from 'passport'

import jwt from 'jsonwebtoken'

const router = express.Router()

router.get(
  '/github',

  passport.authenticate('github', {
  scope: ['user:email'],

  prompt: 'select_account',
})
)

router.get(
  '/github/callback',

  passport.authenticate('github', {
    session: false,
    failureRedirect:
      'http://localhost:5173',
  }),

  async (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '7d',
      }
    )

    res.cookie('token', token, {
      httpOnly: true,

      secure: false,

      sameSite: 'lax',
    })

    res.redirect(
      'http://localhost:5173'
    )
  }
)

export default router