const mongoose = require('mongoose')

const commentSchema = require('./comment')

const postSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  match: {
    type: String,
    required: true
  },
  odds: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema)
