import { useState } from 'react'

const Button = ({ handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // State Variables
  const [selected, setSelected] = useState(0)
  
  // Initializes a zero filled array matching the total number of anecdotes
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  
  // Handler to safely update the votes array immutably
  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  // Handler to select a random anecdote
  const handleNextAnecdote = () => {
    const nextRandom = Math.floor(Math.random() * anecdotes.length)
    setSelected(nextRandom)
  }

  // Calculate the highest vote values dynamically on every render
  const maxVotes = Math.max(...votes)
  const indexOfMax = votes.indexOf(maxVotes)

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>

      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={handleNextAnecdote} text="next anecdote" />

      <h2>Anecdote with most votes</h2>
      <div>{anecdotes[indexOfMax]}</div>
      <div>has {maxVotes} votes</div>   
    </div>
  )
}

export default App