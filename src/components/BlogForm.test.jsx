import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";


test("check, that the form calls the event handler it received as props with the right details when a new blog is created", async () => {
    const addBlog = vi.fn()

    const newBlog = {
        title: 'Title',
        author: 'Author',
        url: 'http://example.com',
    }

    const component = render(<BlogForm addBlog={addBlog} />)

    const person = userEvent.setup()

    const titleInput = component.getByPlaceholderText("title")
    const authorInput = component.getByPlaceholderText("author")
    const urlInput = component.getByPlaceholderText("url")
    const createBtn = component.getByText("Create")

    await person.type(titleInput, newBlog.title)
    await person.type(authorInput, newBlog.author)
    await person.type(urlInput, newBlog.url)
    await person.click(createBtn)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toEqual({ ...newBlog, likes: 0 })
})
