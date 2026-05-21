import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    avatar: {
      type: String,
    },

    provider: {
      type: String,
      enum: ['google', 'github'],
    },

    githubId: {
      type: String,
    },

    googleId: {
      type: String,
    },

    githubAccessToken: {
      type: String,
    },
    dailyAnalysisCount: {
        type: Number,
        default: 0,
    },

    lastAnalysisDate: {
        type: Date,
    }
  },

  {
    timestamps: true,
  },
)

export default mongoose.model(
  'User',
  userSchema
)