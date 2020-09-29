const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

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

test('HTTP POST request to the api successfully creates new entry w/contents properly saved', async () => {
  const newEntry = {
    title:'Test Blog',
    author:'Fake Author',
    url:'https://fakeurl.com',
    likes:0,
  }

  await api
    .post('/api/blogs')
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
    .send(newEntry)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})