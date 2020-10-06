const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog(req.body)
  const user = await User.findById(decodedToken.id)
  blog.user = user._id

  if (blog.title && blog.url) {
    const result = await blog.save()
    res.status(201).json(result)
  } else {
    res.status(400).end()
  }
})

blogsRouter.delete('/:id', async (req, res) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(req.params.id)

  if( blog.user.toString() !== decodedToken.id.toString() ) {
    return res.status(403).json({ error: 'deleting blogs loaded by another user is forbidden' })
  }

  await blog.remove()
  res.status(204).end()
})

blogsRouter.put('/:id', async (req,res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog)
})

module.exports = blogsRouter
