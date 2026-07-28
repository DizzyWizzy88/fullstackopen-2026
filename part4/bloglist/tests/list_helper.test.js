const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const blogs = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/users/UTCS/report/2011-03/dijkstra.html',
            likes: 12,
            __v: 0 
        }
    ]

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated correctly', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 24)
    })
})

describe('favorite blog', () => {
    const listsWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
    
    const blogs = [
        {
            _id: '5a422a851b54a676234d17f7',
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/users/UTCS/report/2011-03/dijkstra.html',
            likes: 12,
            __v: 0
        }
    ]

    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })

    test('when list has only one blog, equals that blog', () => {
        const result = listHelper.favoriteBlog(blogs)
        const expected = {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/users/UTCS/report/2011-03/dijkstra.html',
            likes: 12,
            __v: 0
        }

        assert.deepStrictEqual(result, expected)
    })
})

    describe('most blogs', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/users/UTCS/report/2011-03/dijkstra.html',
                likes: 12,
                __v: 0
            },
            {
                _id: '5a422b8c1b54a676234d17f7',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422ba71b54a676234d17f8',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0
            },
            {
                _id: '5a422bc61b54a676234d17f9',
                title: 'Single URL handling',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 2,
                __v: 0  
            }
        ]

        test('of empty list is null', () => {
            const result = listHelper.mostBlogs([])
            assert.strictEqual(result, null)
        })

        test('when list only one blog, equals the author of that blog', () => {
            const result = listHelper.mostBlogs([blogs[0]])
            assert.deepStrictEqual(result, {
                author: 'Michael Chan',
                blogs: 1
            })
        })

        test('of a bigger list returns the author with the most blogs', () => {
            const result = listHelper.mostBlogs(blogs)
            assert.deepStrictEqual(result, {
                author: 'Robert C. Martin',
                blogs: 3
            })
        })
    })