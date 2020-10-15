import React, { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageColor, setMessageColor] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  // Grabs all blogs
  useEffect(() => {
    async function getBlogList() {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
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

  // Blog form additional functions
  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.createBlog(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      displayNotification(`Blog: "${returnedBlog.title}" by ${returnedBlog.author} added to list`, 'green')
    } catch (e) {
      displayNotification(`Failed to add blog: ${e.response.data.error}`, 'red')
    }
  }

  const updateBlog = async (blog) => {
    const { title, author, url, user, likes, id } = blog
    const updatedObject = {
      title,
      author,
      url,
      likes: likes + 1,
      user: user.id
    }

    try {
      const returnedBlog = await blogService.updateBlog(updatedObject, id)
      const index = blogs.findIndex((e) => e.id === blog.id)
      const newBlogs = [...blogs]
      newBlogs[index].likes = updatedObject.likes
      newBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(newBlogs)
      displayNotification(`Liked blog "${returnedBlog.title}"`, 'green')
    } catch (e) {
      displayNotification(`Failed to like blog: ${e.response.data.error}`, 'red')
    }
  }

  const removeBlog = async (blog) => {
    const { id, title, author } = blog

    if (window.confirm(`Remove ${title} by ${author}?`)) {
      try {
        await blogService.removeBlog(id)
        setBlogs(blogs.filter((el) => el.id !== id))
        displayNotification(`Removed blog "${title}"`, 'green')
      } catch (e) {
        displayNotification(`Failed to remove: ${e.response.data.error}`, 'red')
      }
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

          <Togglable buttonLabel='new entry' ref={blogFormRef}>
            <BlogForm
              createBlog={createBlog}
            />
          </Togglable>

          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              requester={user.username}
              updateBlog={updateBlog}
              removeBlog={removeBlog} />)}
        </div>
      }
    </div>
  )
}

export default App