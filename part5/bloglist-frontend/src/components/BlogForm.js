import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const changeHandler = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={addBlog}>
      <div> title:<input value={newBlog.title} name="title" onChange={(e) => changeHandler(e)} /> </div>
      <div> author:<input value={newBlog.author} name="author" onChange={(e) => changeHandler(e)} /> </div>
      <div> url:<input value={newBlog.url} name="url" onChange={(e) => changeHandler(e)} /> </div>
      <button type="submit">submit</button>
    </form>
  )
}

export default BlogForm