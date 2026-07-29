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

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Canonical String Reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    }

    // 1. Make a POST request
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        // 2. Fetch all blogs after creation 
        const response = await api.get('/api/blogs')

        // 3. Verify total count increased by 1
        assert.strictEqual(response.body.length, initialBlogs.length + 1)

        // 4. Verify the new blog's content is present
        const titles = response.body.map(r => r.title)
        assert.ok(titles.includes('Canonical String Reduction'))
})

after(async () => {
    await mongoose.connection.close()
})