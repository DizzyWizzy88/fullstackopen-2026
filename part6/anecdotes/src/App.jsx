import { useEffect } from "react"
import { useAnecdotesActions } from "./store"
import Notification from "./components/Notification"
import Filter from "./components/Filter"
import AnecdoteList from "./components/AnecdoteList"
import AnecdoteForm from "./components/AnecdoteForm"

const App = () => {
  const { initializeAnecdotes } = useAnecdotesActions()

  useEffect(() => {
    initializeAnecdotes()
  }, [initializeAnecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App