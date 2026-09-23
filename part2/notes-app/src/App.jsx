import { useState, useEffect } from 'react'
import noteService from './services/notes'

const Footer = () => {
    const footerStyle ={
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    return (
        <div style={footerStyle}>
            <br />
            <em>Note app, Department of Computer Science, University of Helsinki 2026</em>
        </div>
    )
}

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                console.log('Data received from backend:', initialNotes)
                setNotes(initialNotes)
            })
    }, [])

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() > 0.5,
        }

        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
    }

    const toggleImportanceOf = (id) => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(n => n.id !== id ? n : returnedNote))
            })
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)

    return (
        <div>
            <h1>Notes</h1>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <li key={note.id} classname="note">
                        {note.content} {' '}
                        <button onClick={() => toggleImportanceOf(note.id)}>
                            {note.important ? 'make not important' : 'make important'}
                        </button>
                    </li>
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                <button type="submit">save</button>
            </form>
            <Footer />
        </div>
    )
}

export default App