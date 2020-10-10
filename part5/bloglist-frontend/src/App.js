import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const [message, setMessage] = useState(null)
  const [messageColor, setMessageColor] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  // Grabs all blogs
  useEffect(() => {
    async function getBlogList() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    getBlogList()
  }, [])

  // Parses data from logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Login/Logout handlers
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      displayNotification('Login successful', 'green')
    } catch (exception) {
      displayNotification('Wrong credentials', 'red')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    displayNotification('Logout successful', 'green')
  }

  // Blog form handlers
  const blogFormHandler = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const returnedBlog = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      displayNotification(`Blog: "${returnedBlog.title}" by ${returnedBlog.author} added to list`, 'green')
    } catch (e) {
      displayNotification(`Failed to add blog: ${e.response.data.error}`, 'red')
    }
  }

  // Notifications

  const displayNotification = (message, color) => {
    setMessage(message)
    setMessageColor(color)
    setTimeout(() => { setMessage(null) }, 5000)
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} color={messageColor} />

      {user === null ?
        <LoginForm
          username={username}
          password={password}
          usernameHandler={(e) => setUsername(e.target.value)}
          passwordHandler={(e) => setPassword(e.target.value)}
          handleLogin={handleLogin} /> :
        <div>
          <h3>{user.name} logged in  <button onClick={handleLogout}>log out</button></h3>
          <BlogForm newBlog={newBlog} addBlog={addBlog} changeHandler={blogFormHandler} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />)}
        </div>
      }
    </div>
  )
}

export default App