import { useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'

export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then((data) => {
            setAnecdotes(data)
        })
    }, [])

    const addAnecdote = async (newAnecdote) => {
        const savedAnecdote = await anecdoteService.createNew(newAnecdote)
        setAnecdotes((prev) => prev.concat(savedAnecdote))
        return savedAnecdote
    }

    const deleteAnecdote = async (id) => {
        await anecdoteService.remove(id)
        setAnecdotes((prev) => prev.filter((a) => a.id !== id))
    }

    return {
        anecdotes,
        addAnecdote,
        deleteAnecdote
    }
}