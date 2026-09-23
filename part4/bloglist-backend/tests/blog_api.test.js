const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let token = null

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    const savedUser = await user.save()

    const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
    }
    token = jwt.sign(userForToken, process.env.SECRET || 'secretKey')

    const blogObjects = helper.initialBlogs.map(blog => ({
        ...blog,
        user: savedUser._id
    }))

    await Blog.insertMany(blogObjects)
})

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as json and correct amount is returned', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        assert.ok(blogs[0].id)
        assert.strictEqual(blogs[0]._id, undefined)
    })
})

describe('addition of a new blog', () => {
    test('succeeds with a valid token and valid data', async () => {
        const newBlog = {
            title: 'Async/await simplifies async code',
            author: 'Edsger W. Dijkstra',
            url: 'https://example.com/async-await',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert.ok(titles.includes('Async/await simplifies async code'))
    })

    test('defaults likes to 0 if missing from request', async () => {
        const newBlogWithoutLikes = {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, 0)
    })

    test('fails with 400 Bad Request if title is missing', async () => {
        const newBlog = {
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('fails with 400 Bad Request if url is missing', async () => {
        const newBlog = {
            title: 'Type wars',
            author: 'Robert C. Martin',
            likes: 2
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('fails with 401 Unauthorized if token is not provided', async () => {
        const newBlog = {
            title: 'Unauthorized Blog Post',
            author: 'Anonymous',
            url: 'https://example.com/unauthorized',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const responseAtStart = await api.get('/api/blogs')
        const blogToDelete = responseAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const responseAtEnd = await api.get('/api/blogs')
        assert.strictEqual(responseAtEnd.body.length, responseAtStart.body.length - 1)

        const titles = responseAtEnd.body.map(r => r.title)
        assert.ok(!titles.includes(blogToDelete.title))
    })
})

describe('updating a blog', () => {
    test('succeeds with status code 200 when updating likes on an existing blog', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]

        const updatedData = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})