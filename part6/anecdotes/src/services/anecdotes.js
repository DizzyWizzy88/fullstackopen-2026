const baseUrl = "http://localhost:3001/anecdotes"

export const getAll = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) throw new Error("Failed to fetch anecdotes")
  return res.json()
}

export const createNew = async (content) => {
  const newObject = { content, votes: 0 }
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newObject),
  })
  if (!res.ok) throw new Error("Failed to create anecdote")
  return res.json()
}

export const updateVote = async (anecdote) => {
  const updated = { ...anecdote, votes: anecdote.votes + 1 }
  const res = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  })
  if (!res.ok) throw new Error("Failed to update vote")
  return res.json()
}

export const remove = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete anecdote")
  return res.json()
}