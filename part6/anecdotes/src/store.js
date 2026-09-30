import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  notification: null,

  actions: {
    // Initial fetch from json-server / backend
    initializeAnecdotes: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },

    // Create anecdote via API and append to state
    addAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))
    },

    // Vote anecdote via API update
    voteAnecdote: async (id) => {
      const anecdoteToVote = get().anecdotes.find((a) => a.id === id)
      if (!anecdoteToVote) return

      const updatedAnecdote = await anecdoteService.update(id, {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      })

      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedAnecdote : a
        ),
      }))
    },

    // Delete anecdote via API and remove from state immediately
    deleteAnecdote: async (id) => {
      // 1. Remove from state immediately so DOM updates instantly
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }))

      // 2. Perform backend API delete
      await anecdoteService.remove(id)
    },

    // Filter control
    setFilter: (filter) => set({ filter }),

    // Notification control with auto-clear timeout
    setNotification: (message, timeoutSeconds = 5) => {
      // Clear previous timeout if active
      const currentTimeout = get()._notificationTimeout
      if (currentTimeout) clearTimeout(currentTimeout)

      set({ notification: message })

      const timeoutId = setTimeout(() => {
        set({ notification: null, _notificationTimeout: null })
      }, timeoutSeconds * 1000)

      set({ _notificationTimeout: timeoutId })
    },
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  // Returns filtered and vote-sorted anecdotes
  return anecdotes
    .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => b.votes - a.votes)
}

export const useNotification = () => useAnecdoteStore((state) => state.notification)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdotesActions = () => useAnecdoteStore((state) => state.actions)