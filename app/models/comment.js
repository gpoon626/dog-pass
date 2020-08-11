const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    // References use the type ObjectID
    type: mongoose.Schema.Types.ObjectId,
    // the name of the model to they review
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = commentSchema
