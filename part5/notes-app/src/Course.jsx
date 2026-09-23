import React from 'react'

// Helper component 1
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

// Helper component 2
const Header = ({ courseName }) => {
  return <h1>{courseName}</h1>
}

// Helper component 3
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

// Main Course component
const Course = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <p><strong>total of {total} exercises</strong></p>
    </div>
  )
}

// Exporting Course as the default export of this module
export default Course