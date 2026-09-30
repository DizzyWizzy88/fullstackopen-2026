// src/components/CreateNew.jsx
import { useNavigate } from 'react-router-dom'

const CreateNew = ({ addNew }) => {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Extract input values (adjust to match your custom useField or standard state inputs)
    const content = e.target.content.value
    const author = e.target.author.value
    const info = e.target.info.value

    await addNew({
      content,
      author,
      info,
      votes: 0
    })
    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name="content" />
        </div>
        <div>
          author
          <input name="author" />
        </div>
        <div>
          url for more info
          <input name="info" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateNew