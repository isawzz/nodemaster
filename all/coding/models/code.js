const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
  keywords: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  snippet: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
		default: 'js'
  },
})

module.exports = mongoose.model('Code', codeSchema)