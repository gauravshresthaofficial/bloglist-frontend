import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from './Blog'
import { beforeEach, expect, vi } from "vitest";

let component

const blog = {
    title: 'Title',
    author: 'Author',
    url: 'http://example.com',
  likes: 10,
  user: {
    username: 'test.user@test.com',
    name: 'Test User',
  }
}

const user = {
  username: 'user@gmail.com',
  name: "user"
}

const updateLikes = vi.fn()
const handleDelete = vi.fn()
const person = userEvent.setup()

beforeEach(() => {
  component = render(<Blog blog={blog} updateLikes={updateLikes} user={user} handleDelete={handleDelete} />)
})

test("shows title and author, hides URL and likes", () => {
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container).not.toHaveTextContent(blog.url)
  expect(component.container).not.toHaveTextContent(blog.likes)
})


test("reveals URL and likes on 'View' click", async () => {
  const showBtn = component.getByText("View")
  await person.click(showBtn)
  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)
})

test("calls updateLikes twice on double like click", async () => {
  const showBtn = component.getByText("View")
  await person.click(showBtn)
  const likeBtn = component.getByText("Like")
  await person.dblClick(likeBtn)

  expect(updateLikes.mock.calls).toHaveLength(2)
})