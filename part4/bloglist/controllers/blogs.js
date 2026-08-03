const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// Helper function to extract the Bearer token from headers
const getTokenFrom = request => {
    const authorization = request.headers.authorization
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.substring(7)
    }
    return null
} 

// GET all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
    })

// POST new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    try {
        const body = request.body
        
        // request.user is now set directly by the middleware
        const user = request.user

        if (!user) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })

        const savedBlog = await blog.save()
        
        // Save reference to the blog in user document
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findById(request.params.id)

    if ( blog.user.toString() === userid.toString() ) {
    response.status(204).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes},
        { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

module.exports = blogsRouter