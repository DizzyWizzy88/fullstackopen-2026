const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    return blogs.reduce((max, blog) => {
        return blog.likes > max.likes ? blog : max
    }, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    
    // 1. Group blogs by author: { 'Author A': [blog1, blog2], 'Author B': [blog3] }
    const groupedByAuthor = _.groupBy(blogs, 'author')

    // 2. Transform into an array of objects: [{ author: 'Author A', blogs: 2 }, ...]
    const authorCounts = _.map(groupedByAuthor, (authorBlogs, author) => {
        return {
            author: author,
            blogs: authorBlogs.length
        }
    })

    // 3. Find the object with the highest 'blogs' property
    return _.maxBy(authorCounts, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    // 1. Group blogs by author: { 'Author A': [blog1, blog2], 'Author B': [blog3] }
    const groupedByAuthor = _.groupBy(blogs, 'author')

    // 2. Transform into an array of objects calculating total likes per author
    const authorLikes = _.map(groupedByAuthor, (authorBlogs, author) => {
        const totalLikes = _.sumBy(authorBlogs, 'likes')
        return {
            author: author,
            likes: totalLikes
        }
    })

    // 3. Find the author object with the maximum likes
    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}