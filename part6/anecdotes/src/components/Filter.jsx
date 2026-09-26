import { useFilter, useAnecdotesActions } from "../store"

const Filter = () => {
  const filter = useFilter()
  const { setFilter } = useAnecdotesActions()

  return (
    <div style={{ marginBottom: 10 }}>
      filter{" "}
      <input
        data-testid="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  )
}

export default Filter