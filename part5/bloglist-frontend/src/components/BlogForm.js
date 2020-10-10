import React from "react";

const BlogForm = ({ newBlog, addBlog, changeHandler }) => {
  return (
    <form onSubmit={addBlog}>
      <div> title:<input value={newBlog.title} name="title" onChange={(e) => changeHandler(e)} /> </div>
      <div> author:<input value={newBlog.author} name="author" onChange={(e) => changeHandler(e)} /> </div>
      <div> url:<input value={newBlog.url} name="url" onChange={(e) => changeHandler(e)} /> </div>
      <button type="submit">submit</button>
    </form>
  )
}

export default BlogForm;