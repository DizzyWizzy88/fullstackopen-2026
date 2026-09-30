import { Link } from 'react-router-dom'

const AnecdoteList = ({ anecdotes, handleDelete }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          {handleDelete && (
            <button onClick={() => handleDelete(anecdote.id)}>delete</button>
          )}
        </li>
      ))}
    </ul>
  </div>
)

export default AnecdoteList
