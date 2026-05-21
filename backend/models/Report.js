import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema({
  repoUrl:   { type: String, required: true },
  repoName:  { type: String },
  status:    { type: String, enum: ['processing', 'complete', 'error'], default: 'processing' },
  error:     { type: String },
  loc:       { type: Object },
  fileTree:  { type: Object },
  techStack: { type: [String] },
  diagram:   { type: String },
  summary:   { type: String },
  scoring:   { type: Object },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Report', ReportSchema)