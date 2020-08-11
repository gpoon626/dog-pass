// const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
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

// CREATE
router.post('/posts', requireToken, (req, res, next) => {
  // get the data from the request object ?
  req.body.post.owner = req.user.id
  Post.create(req.body.post)
    .then(post => {
      res.status(201).json({post: post.toObject()})
    })
    .catch(next)
})

// INDEX
router.get('/posts', requireToken, (req, res, next) => {
  Post.find()
    .then(posts => {
      console.log(posts)
      return posts.map(post => post.toObject())
    })
    .then(posts => res.status(200).json({ posts: posts }))
    .catch(next)
})

// SHOW
router.get('/posts/:id', requireToken, (req, res, next) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => res.status(200).json({ post: post.toObject() }))
    .catch(next)
})

// UPDATE
router.patch('/posts/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.post.owner
  // console.log(req)
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      requireOwnership(req, post)

      return post.updateOne(req.body.post)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/posts/:id', requireToken, (req, res, next) => {
  Post.findById(req.params.id)
    .then(handle404)
    .then(post => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, post)
      // delete the example ONLY IF the above didn't throw
      post.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
