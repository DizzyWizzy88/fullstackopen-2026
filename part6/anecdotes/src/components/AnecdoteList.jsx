import { useAnecdotes, useFilter, useAnecdotesActions } from "../store"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const { voteAnecdote, deleteAnecdote } = useAnecdotesActions()

  // Filter matching items and sort descending by votes
  const displayedAnecdotes = [...anecdotes]
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {displayedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => deleteAnecdote(anecdote.id)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList