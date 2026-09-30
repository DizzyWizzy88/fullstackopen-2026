import { useAnecdotesActions } from '../store'

const AnecdoteForm = () => {
  const { addAnecdote, setNotification } = useAnecdotesActions()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    if (content.trim()) {
      await addAnecdote(content)
      setNotification(`you created '${content}'`, 5)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm