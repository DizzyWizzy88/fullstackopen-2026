require('dotenv').config()
const path = require('path')
const express = require('express')
const Person = require('./models/person')

const app = express()

// Core Express Middleware
// Ensure express.json() is called FIRST so request.body is parsed
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))

//Formats JSON responses with 2-space indentation
app.set('json spaces', 2)

// GET all persons from MongoDB
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

// GET single person by ID (Triggers CastError if Id is malformed)
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
}) 

// Get info page showing count and current timestamp
app.info = app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date()
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
                `)
                .catch(error => next(error))
        })
})

// POST new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
        response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            // 204 No Content indicates successful deltetion
            response.status(204).end()
        })
        .catch(error => next(error))
})

// PUT update an existing person's number
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    // { new: true } returns the updated document instead of the original
    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Middleware for handling requests to unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Centralized Error Handling Middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// Needs to be the last loaded middleware!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})