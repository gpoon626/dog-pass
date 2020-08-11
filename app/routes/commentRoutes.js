const express = require('express')

const passport = require('passport')

const router = express.Router()
// require book models
const Post = require('./../models/post.js')

const customErrors = require('./../../lib/custom_errors')

const handle404 = require('../../lib/custom_errors')

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', {session: false})

// comment create route
// CREATE
// POST /comments/
router.post('/comments', (req, res, next) => {
  console.log('now', req.body)

  // get the data from the request object ?
  // .content could be .comment?
  const commentData = req.body.comment

  console.log(commentData)

  const postId = req.body.comment.postId

  console.log(postId)
  Post.findById(postId)
    .then(handle404)
    .then(post => {
      console.log('37', post)
      post.comments.push(commentData)

      return post.save()
    })
    .then(post => res.status(201).json({post: post}))
    .catch(next)
})

module.exports = router
