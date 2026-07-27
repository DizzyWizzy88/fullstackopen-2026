const mongoose = require('mongoose')

// At least the password argument is provided
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

// Replace encodeURIComponent(password) with explicit replacement for '!'
const cleanPassword = encodeURIComponent(password).replace(/!/g, '%21')
const url = `mongodb+srv://dr3930397_db_user:${cleanPassword}@cluster0.1wtdwhw.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// Schema & Model definition for Phonebook Person
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

async function main() {
  try {
    console.log('Connecting to MongoDB Atlas...')
    await mongoose.connect(url, { family: 4, serverSelectionTimeoutMS: 5000 })
    console.log('Connected successfully!')

    // Commmand-line Argument Logic
    if (process.argv.length === 3) {
        const people = await Person.find({})
        console.log('phonebook:')
        people.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    } else if (process.argv.length >= 5) {
    // Case 2: Password, Name, and Number provided -> Save new entry
    const name = process.argv[3]
    const number = process.argv[4]

            const person = new Person({ name, number })
            await person.save()
            console.log(`added ${name} number ${number} to phonebook`)
        }
    } catch (error) {
        console.error('Connection error details:', error.message)
    } finally {
        await mongoose.connection.close()
    }
}

main()