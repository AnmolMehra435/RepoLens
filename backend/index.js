import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import analyzeRouter from './routes/analyze.js'
import cookieParser from 'cookie-parser'

import session from 'express-session'

import passport from './config/passport.js'

import authRoutes
from './routes/authRoutes.js'

import userRoutes
from './routes/userRoutes.js'

import reportHistoryRoutes
from './routes/reportHistoryRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000


app.use(
  cors({
    origin: 'http://localhost:5173',

    credentials: true,
  })
)

app.use(cookieParser())

app.use(
  session({
    secret: process.env.JWT_SECRET,

    resave: false,

    saveUninitialized: false,
  })
)

app.use(passport.initialize())

app.use(passport.session())

app.use(express.json())

app.use('/api', analyzeRouter)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use(
  '/api/reports',
  reportHistoryRoutes
)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })