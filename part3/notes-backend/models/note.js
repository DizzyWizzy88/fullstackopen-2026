require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

let url = process.env.MONGODB_URI

if (url) {
    // Split at `@` to safely isolate the username:password section from host/options
    const parts = url.split('@')
    if (parts.length === 2) {
        const credentials = parts[0].replace(/!/g, '%21').replace(/\?/g, '%3F')
        url = `${credentials}@${parts[1]}`
    }
}

console.log('connecting to', url)

mongoose.connect(url, {family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

    const noteSchema = new mongoose.Schema({
        content: String,
        important: Boolean,
        date: {
            type: Date,
            default: Date.now,
        },
    })

    noteSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    module.exports = mongoose.model('Note', noteSchema)