import { useState, useEffect } from 'react'
import personService from './services/persons'


// Inline Notification component uniquely named to avoid browser namespace collision
const NotificationBanner = ({ message, isError }) => {
    if (message === null) {
        return null
    }

    const bannerStyle = {
        color: isError ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderColor: isError ? 'red' : 'green',
        borderStyle: 'solid',
        borderWidth: 3,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={bannerStyle}>
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterQuery, setFilterQuery] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [isError, setIsError] = useState(false)

    // Fetch initial data from db.json using the personService module
    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
            .catch(error => {
                showNotification('Failed to fetch initial contact list.', true)
            })
    }, [])

    // Helper function to handle timing out notifications
    const showNotification = (message, errorStatus = false) => {
        setNotificationMessage(message)
        setIsError(errorStatus)
        setTimeout(() => {
            setNotificationMessage(null)
        }, 3000)
    }

    // Handle Form Submission
    const addPerson = (event) => {
        event.preventDefault()

        const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

        // Exercise 2.15: Handle updating an existing number
        if (existingPerson) {
            const confirmUpdate = window.confirm(
                `${newName} is already added to the phonebook, replace the old number with a new one?`
            )

            if (confirmUpdate) {
                const changedPerson = { ...existingPerson, number: newNumber }

                personService
                    .update(existingPerson.id, changedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
                        showNotification(`Updated number for ${returnedPerson.name}`)
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        showNotification(`Information of ${existingPerson.name} has already been removed from server`, true)
                        setPersons(persons.filter(p => p.id !== existingPerson.id))
                    })
            }

            return
        }

        // Creating a brand new contact record
        const personObject = {
            name: newName,
            number: newNumber
        }

        personService
            .create(personObject)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                showNotification(`Added ${returnedPerson.name}`)
                setNewName('')
                setNewNumber('')
            })
            .catch(error => {
                showNotification('Failed to create new contact.', true)
            })
    }

    // Exercise 2.16: Handle deleting an entry
    const handleDeleteOf = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            personService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== id))
                    showNotification(`Deleted ${name}`)
                })
                .catch(error => {
                    showNotification(`The contact ${name} was already deleted from the server.`, true)
                    setPersons(persons.filter(p => p.id !== id))
                })
        }
    }

    // Filter persons array dynamically based on the input text value
    const personsToShow = filterQuery
        ? persons.filter(person => person.name.toLowerCase().includes(filterQuery.toLowerCase()))
        : persons

    return (
        <div>
            <h2>Phonebook</h2>

            {/* Visual alerts banner */}
            <NotificationBanner message={notificationMessage} isError={isError} />

            <div>
                filter shown with <input value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
            </div>

            <h3>Add a new</h3>
            <form onSubmit={addPerson}>
                <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
                <div><button type="submit">add</button></div>
            </form>

            <h3>Numbers</h3>
            <ul style={{ paddingLeft: 0, margin: 0 }}>
                {personsToShow.map(person =>
                    <li key={person.id} style={{ listStyleType: 'none', marginBottom: '5px' }}>
                        {person.name} {person.number} {' '}
                        <button onClick={() => handleDeleteOf(person.id, person.name)}>delete</button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default App