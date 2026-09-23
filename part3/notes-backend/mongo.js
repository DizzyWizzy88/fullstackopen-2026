const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

// Escape both ! and ? so MongoDB parses the password correctly
const cleanPassword = encodeURIComponent(password)
    .replace(/!/g, '%21')
    .replace(/\?/g, '%3F')

const url = `mongodb+srv://dr3930397_db_user:${cleanPassword}@cluster0.1wtdwhw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// Match the clean formatting used in note.js
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

// If only password is provided: fetch and log all notes
if (process.argv.length === 3) {
    Note.find({}).then(result => {
        console.log('noteApp:')
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}
// If password and content are provided: create default initial notes or new note
else {
    const note = new Note({
        content: process.argv[3],
        important: process.argv[4] === 'true' || true,
    })

    note.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })
}