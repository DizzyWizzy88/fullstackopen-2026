import useFeedbackStore from './useFeedbackStore'

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positivePercentage = total === 0 ? 0 : (good / total) * 100

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={`${positivePercentage} %`} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const increaseGood = useFeedbackStore((state) => state.increaseGood)
  const increaseNeutral = useFeedbackStore((state) => state.increaseNeutral)
  const increaseBad = useFeedbackStore((state) => state.increaseBad)

  return (
    <div>
      <h1>Unicafe</h1>
      <h2>give feedback</h2>
      <button onClick={increaseGood}>good</button>
      <button onClick={increaseNeutral}>neutral</button>
      <button onClick={increaseBad}>bad</button>
      <Statistics />
    </div>
  )
}

export default App