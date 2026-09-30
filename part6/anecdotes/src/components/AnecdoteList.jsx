import { useAnecdotes, useAnecdotesActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { voteAnecdote, deleteAnecdote, setNotification } = useAnecdotesActions()

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote.id)
    setNotification(`you voted '${anecdote.content}'`, 5)
  }

  const handleDelete = (anecdote) => {
    deleteAnecdote(anecdote.id)
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList