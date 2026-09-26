import { create } from "zustand"
import * as anecdoteService from "./services/anecdotes"

let notificationTimer = null

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  notification: "",

  actions: {
    // Fetch initial backend data
    initializeAnecdotes: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },

    // Create new anecdote and persist
    addAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },

    // Vote on an anecdote and trigger temporary notification
    voteAnecdote: async (anecdote) => {
      const updated = await anecdoteService.updateVote(anecdote)
      set((state) => ({
        anecdotes: state.anecdotes.map((a) => (a.id === anecdote.id ? updated : a)),
        notification: `you voted '${anecdote.content}'`,
      }))

      if (notificationTimer) clearTimeout(notificationTimer)
      notificationTimer = setTimeout(() => {
        set({ notification: "" })
      }, 5000)
    },

    // Delete an anecdote
    deleteAnecdote: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }))
    },

    // Update filter text
    setFilter: (text) => set({ filter: text }),
  },
}))

// Custom Hook Selectors
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useNotification = () => useAnecdoteStore((state) => state.notification)
export const useAnecdotesActions = () => useAnecdoteStore((state) => state.actions)