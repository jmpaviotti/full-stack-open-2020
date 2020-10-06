const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/User')

describe('when there is initially some notes saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('correct amount of blogposts is returned in json format', async () => {
    const response = await api.get('/api/blogs')

    expect(response.type).toBe('application/json')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

  test('HTTP POST request to the api fails with proper status code if token is not provided', async () => {
    const newEntry = {
      title:'Test Blog',
      author:'Fake Author',
      url:'https://fakeurl.com',
      likes:0,
    }

    await api
      .post('/api/blogs')
      .send(newEntry)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(helper.initialBlogs.length)
  })

  let token
  describe('when an user is logged in', () => {

    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('someonespassword', 10)
      const user = new User({ username: 'someone', name: 'Som E. One', passwordHash })
      await user.save()

      token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
    })


    test('HTTP POST request to the api creates new entry if corresponding token is provided', async () => {
      const newEntry = {
        title:'Test Blog',
        author:'Fake Author',
        url:'https://fakeurl.com',
        likes:0,
      }

      await api
        .post('/api/blogs')
        .auth(token, { type: 'bearer' })
        .send(newEntry)

      const blogsAfter = await api.get('/api/blogs')
      const newEntryInDb = await Blog.findOne({ 'title' : newEntry.title })

      expect(blogsAfter.body).toHaveLength(helper.initialBlogs.length + 1)

      expect(newEntryInDb.author).toBe('Fake Author')
      expect(newEntryInDb.url).toBe('https://fakeurl.com')
      expect(newEntryInDb.likes).toBe(0)
    })

    test('if likes property is missing from post body in request, it defaults to 0', async () => {
      const newEntry = {
        title:'Test Blog 2',
        author:'Fake Author',
        url:'https://fakeurl2.com',
      }

      await api
        .post('/api/blogs')
        .auth(token, { type: 'bearer' })
        .send(newEntry)

      await api.get('/api/blogs')

      const newEntryInDb = await Blog.findOne({ 'title' : newEntry.title })
      expect(newEntryInDb.likes).toBe(0)
    })

    test('if title/url property is missing, backend responds with status code 400 Bad Request', async () => {
      const newEntry = {
        author:'Fake Author',
        likes:0,
      }

      await api
        .post('/api/blogs')
        .auth(token, { type: 'bearer' })
        .send(newEntry)
        .expect(400)
    })
  })

  describe('when there is initially one user at db', () => {

    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('donttellanyone', 10)
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.getAllUsers()

      const newUser = {
        username: 'jmpaviotti',
        name: 'Julian Paviotti',
        password: 'jmpaviotti',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.getAllUsers()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails if username already taken', async () => {
      const usersAtStart = await helper.getAllUsers()

      const newUser = {
        username: 'root',
        name: 'wrongone',
        password: 'rootguy',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.getAllUsers()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if username is missing', async () => {
      const usersAtStart = await helper.getAllUsers()

      const newUser = {
        name: 'wrongone',
        password: 'rootguy',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` is required')

      const usersAtEnd = await helper.getAllUsers()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if username is too short', async () => {
      const usersAtStart = await helper.getAllUsers()

      const newUser = {
        username: 'ne',
        name: 'wrongone',
        password: 'rootguy',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('shorter than the minimum allowed length')

      const usersAtEnd = await helper.getAllUsers()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if password is missing', async () => {
      const usersAtStart = await helper.getAllUsers()

      const newUser = {
        username: 'newguy',
        name: 'wrongone',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`password` is required')

      const usersAtEnd = await helper.getAllUsers()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if password is too short', async () => {
      const usersAtStart = await helper.getAllUsers()

      const newUser = {
        username: 'newguy',
        name: 'wrongone',
        password: 'ro',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('shorter than the minimum allowed length')

      const usersAtEnd = await helper.getAllUsers()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })
})
/*
  test('user can add a blog, provided they have a proper authentication token', async () => {
    const credentials = { username: 'newguy', password: 'helloimnew' }
    const newEntry = {
      title:'Test Blog',
      author:'Fake Author',
      url:'https://fakeurl.com',
    }

    const user = await api
      .post('/api/users')
      .send({ ...credentials, name: 'New Guy' })

    const auth = await api
      .post('/api/login')
      .send(credentials)

    const response = await api
      .post('/api/blogs')
      .auth(auth.body.token, { type: 'bearer' })
      .send(newEntry)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.user).toBe(user.body.id)
  })*/




afterAll(() => {
  mongoose.connection.close()
})