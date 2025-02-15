import { useState } from "react"

const Blog = ({ blog, updateLikes, user, handleDelete }) => {
  const [show, setShow] = useState(false)

  const toggleVisibility = () => {
    setShow((prev) => !prev)
  }

  const blogStyle = {
    padding: "10px 0 10px 6px",
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    < div style={blogStyle}>
      {blog.title}
      <button onClick={toggleVisibility}>{show ? "Hide" : "View"}</button>
      {show ?
        <div>
          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p style={{ display: "inline", margin: "0 8px 0 0" }}>{blog.likes}</p>
          <button style={{ display: "inline" }} onClick={() => updateLikes(blog)}>Like</button>
          <p>{blog.user?.name}</p>
          {(user.username == blog.user?.username) ? <button onClick={() => handleDelete(blog.id)}>Delete</button> : ""}
        </div>
        : ""}
    </div >
  )
}

export default Blog