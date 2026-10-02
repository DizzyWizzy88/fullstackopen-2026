import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from './services/users'
import { useUserValue, useUserDispatch } from './UserContext'
import { useBlogs } from './hooks/useBlogMutations'
import BlogList from './components/BlogList'
import BlogDetail from './components/BlogDetail'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const navigate = useNavigate()

  const { data: blogs = [] } = useBlogs()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  const blogMatch = useMatch('blogs/:id')
  const matchedBlog = blogMatch 
    ? blogs.find(blog => blog.id === blogMatch.params.id) 
    : null

    const userMatch = useMatch('/users/:id')
    const matchedUser = userMatch
      ? users.find((user) => user.id === userMatch.params.id)
      : null
      
    const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'CLEAR_USER '})
    navigate('/login')
  }

  return (
    <div>
      <nav style={{ padding: 10, background: '#eee', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
        <span>{user.name} logged in </span>
        <button onClick={handleLogout}>logout</button>
      </nav>

      <h2>blogs</h2>
      <Notification />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/blogs/:id" element={<BlogDetail blog={matchedBlog} />} />
        <Route path="/users/:id" element={<UserList users={users} />} />
        <Route path="/users/:id" element={<UserDetail user={matchedUser} />} />
      </Routes>
    </div>
  )
}

export default App