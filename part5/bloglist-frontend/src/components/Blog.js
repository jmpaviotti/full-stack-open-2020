import React, { useState } from 'react'

const Blog = ({ blog, requester, updateBlog, removeBlog }) => {
  const { title, author, url, likes, user } = blog
  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogData = () => {
    return (
      <div>
        <div>{url}</div>
        <div>
          likes: {likes} {' '}
          <button onClick={() => updateBlog(blog)}>like</button>
        </div>
        <div>{user.name}</div>
        { user.username === requester &&
          <button onClick={() => removeBlog(blog)}>remove</button>}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {title}{','} {author} {' '}
      {showFull ?
        <button onClick={() => setShowFull(false)}>hide</button> :
        <button onClick={() => setShowFull(true)}>show</button>}
      { showFull && blogData()}
    </div>
  )
}

export default Blog
