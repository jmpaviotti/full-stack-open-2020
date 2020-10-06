const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')

  response.json(users)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  if(!body.password) {
    return res.status(400).json({ error: '`password` is required' })
  }

  if(body.password.length < 3) {
    return res.status(400).json({ error: '`password` is shorter than the minimum allowed length (3).' })
  }

  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

module.exports = usersRouter