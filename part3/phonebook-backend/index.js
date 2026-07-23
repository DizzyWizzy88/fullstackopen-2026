const express = require('express')
const morgan = require('morgan')
const app = express()

//Formats JSON responses with 2-space indentation
app.set('json spaces', 2)

// Ensure express.json() is called FIRST so request.body is parsed
app.use(express.json())

// Define a custom morgan token named 'req-body'
morgan.token('req-body', (request) => {
    // Only log the body for POST requests to avoid exra output on GET/DELETE
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
    return ''
})

// Configure morgan format string including the custom :req-body token
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :req-body')

)

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Info route
app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
        `)
})

// Single person info route
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        // return 404 status if it is not in the array
        response.status(404).end()
    }
})

// Single person deletion route
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    // 204 No Content signifies successful deletion with no body returned
    response.status(204).end()
})

// Add a new person entry
app.post('/api/persons', (request, response) => {
    const body = request.body

    // Basic check to ensure name exists
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    // Check if number is missing
    if (!body.number) {
        return  response.status(400).json({
            error: 'number missing'
        })
    }

    // Check if the name already exists in the phonebook
    const nameExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }


    //Generate a random ID (e.g., between 1 and 1,000,000)
    const randomId = Math.floor(Math.random() * 1000000).toString()

    const person = {
        id: randomId,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})