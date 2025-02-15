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

export default BlogForm