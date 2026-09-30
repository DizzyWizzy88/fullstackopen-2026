
// src/App.jsx
import { useState } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'
import Anecdote from './components/Anecdote'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, addAnecdote, deleteAnecdote } = useAnecdotes()
  const [notification, setNotification] = useState('')

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find((a) => a.id === Number(match.params.id))
    : null

  const addNew = async (anecdote) => {
    await addAnecdote(anecdote)
    setNotification(`a new anecdote '${anecdote.content}' created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const handleDelete = async (id) => {
    await deleteAnecdote(id)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification && <div>{notification}</div>}
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} handleDelete={handleDelete} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App