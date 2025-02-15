import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import axios from 'axios'


const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {
  return (
    <form onSubmit={handleLogin}>
      <h2>Login to the application</h2>
      <p>username</p>
      <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <p>password</p>
      <input
        type="text"
        value={password}
        onChange={({ target }) => { setPassword(target.value) }}
      />
      <button type='submit' >Login</button>
    </form>
  )
}

const BlogForm = ({ newBlog, handleChange, handleBlog }) => {
  return (
    <form onSubmit={handleBlog}>
      <h2>Create new blog</h2>
      <p>Title</p><input type='text' name='title' value={newBlog.title} onChange={handleChange} />
      <p>Author</p><input type='text' name='author' value={newBlog.author} onChange={handleChange} />
      <p>Url</p><input type='text' name='url' value={newBlog.url} onChange={handleChange} />
      {/* <p>Likes</p><input type='number' name='likes' value={newBlog.likes} onChange={handleChange} /> */}

      <button type='submit'>Create</button>
    </form>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    likes: 0,
    url: '',

  })
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
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
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

  const handleBlog = async (e) => {
    e.preventDefault()
    console.log("Blog form button clicked", newBlog)

    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs((prevBlogs) => prevBlogs.concat(returnedBlog))
      setNewBlog({
        title: '',
        author: '',
        likes: 0,
        url: '',

      })
      setNotification({
        type: "success",
        text: `New Blog added by ${user.username}`
      })
    } catch (error) {
      console.log("Error adding: ", error.response.data.error)
      setNotification({
        type: "error",
        text: error.response.data.error
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewBlog((prevBlog) => ({
      ...prevBlog, [name]: value
    }))
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
        /> :
        <div>
          <h2>blogs</h2>
          <p>{user.username} logged in</p>
          <button onClick={handleLogout}>Log Out</button>
          <BlogForm handleBlog={handleBlog} handleChange={handleChange} newBlog={newBlog} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </>
  )
}



export default App