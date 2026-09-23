require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.set('json spaces', 2)

// GET all notes by MongoDB Atlas
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
    response.json(notes)
    })
})

// GET a single note by ID
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

// DELETE a note by ID
app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

// POST create a new note
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    
    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})