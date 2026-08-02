const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
    })

blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        // Find the first user in the database to attach as creator
        const user = await User.findOne({})

        if (!user) {
            return response.status(400).json({ error: 'no user to assign blog to' })
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
    await Blog.findbyDelete(request.params.id)
    response.status(204).end()
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