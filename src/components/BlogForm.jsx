import { useState } from "react"

const BlogForm = ({ addBlog }) => {

    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        likes: 0,
        url: '',

    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewBlog((prevBlog) => ({
            ...prevBlog, [name]: value
        }))
    }

    const handleBlog = async (e) => {
        e.preventDefault()
        const success = await addBlog(newBlog)
        if (success) {
            setNewBlog({
                title: '',
                author: '',
                likes: 0,
                url: '',

            })
        }
    }
    return (
        <form onSubmit={handleBlog}>
            <h2>Create new blog</h2>
            <p>Title</p><input type='text' name='title' value={newBlog.title} onChange={handleChange} placeholder="title" />
            <p>Author</p><input type='text' name='author' value={newBlog.author} onChange={handleChange} placeholder="author" />
            <p>Url</p><input type='text' name='url' value={newBlog.url} onChange={handleChange} placeholder="url" />
            {/* <p>Likes</p><input type='number' name='likes' value={newBlog.likes} onChange={handleChange} /> */}

            <button type='submit'>Create</button>
        </form>
    )
}

export default BlogForm