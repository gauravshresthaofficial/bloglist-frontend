import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import axios from 'axios'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginFrom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(sortBlogs(blogs))
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault()
    try {

      const user = await loginService.login({ username, password })
      console.log(user)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        type: "success",
        text: "Login successful."
      })
    } catch (error) {
      console.log("error:", error.message)
      setNotification({
        type: "error",
        text: "Wrong username or password"
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser")
    setUser(null)
    setNotification({
      type: "success",
      text: "Logout Successful."
    })
  }

  const addBlog = async (newBlog) => {
    console.log("Blog form button clicked", newBlog)

    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog))

      setNotification({
        type: "success",
        text: `New Blog added by ${user.username}`
      })
      return true
    } catch (error) {
      console.log("Error adding: ", error.response.data.error)
      setNotification({
        type: "error",
        text: error.response.data.error
      })
      return false
    }
  }



  const updateLikes = async (blog) => {
    const { id, title, author, likes, url } = blog

    try {
      const updatedBlog = await blogService.update({
        id, title, author, likes: likes + 1, url
      })
      setBlogs((prevBlogs) => sortBlogs(prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))))
      setNotification({
        type: "success",
        text: "Update Successful"
      })
    } catch (error) {
      console.log("Error updating:", error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete?")) {
      try {
        await blogService.deleteBlog(id)
        setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.id != id))
        setNotification({
          type: "success",
          text: 'Delete sucessfull'
        })
      } catch (error) {
        console.log("Error deleting:", error.message)
        setNotification({
          type: "success",
          text: 'Error on deletion'
        })
      }

    }
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }



  return (
    <>
      <Notification notification={notification} setNotification={setNotification} />
      {user === null ?

        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />

        :
        <div>
          <h2>blogs</h2>
          <p>{user.username} logged in</p><button onClick={handleLogout}>Log Out</button>
          <Toggleable buttonLabel='New Blog'>
            <BlogForm addBlog={addBlog} />
          </Toggleable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateLikes={updateLikes} user={user} handleDelete={handleDelete} />
          )}
          {/* <Toggleable>dsafasdf</Toggleable> */}
        </div>
      }
    </>
  )
}



export default App