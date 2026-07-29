const { test, after, before, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    }
]

// 1. Explicitly connect before tests in this file run
before(async () => {
    // Ensure we wait for Mongoose to connect to the TEST database
    if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.MONGODB_URI)
    }
})

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as json and correct amount is returned', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body

    //Check that the first blog object has an 'id' property defined
    assert.ok(blogs[0].id)
    // Optionally we can verify that '_id' is undefined after transformation
    assert.strictEqual(blogs[0]._id, undefined)
})

after(async () => {
    await mongoose.connection.close()
})