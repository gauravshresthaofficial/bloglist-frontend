// import { expect } from "@playwright/test";

const newUser = {
  username: "Saurav",
  name: "Saurav Shrestha",
  password: "iamsecure",
};

const anotherUser = {
  username: "Gaurav",
  name: "Gaurav Shrestha",
  password: "secret",
};

const newBlog = {
  title: "Learning JavaScript",
  author: "Saurav Shrestha",
  url: "https://www.example.com/learning-javascript",
  likes: 10,
};

const anotherBlog = {
  title: "Learning Python",
  author: "Gaurav Shrestha",
  url: "https://www.example.com/learning-python",
  likes: 12,
};

const thirdBlog = {
  title: "Learning Java",
  author: "Gaurav Shrestha",
  url: "https://www.example.com/learning-java",
  likes: 2,
};
const forthBlog = {
  title: "Learning C",
  author: "Gaurav Shrestha",
  url: "https://www.example.com/learning-c",
  likes: 6,
};

const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);

  await page.getByRole("button", { name: "Login" }).click();
};
const createNewBlog = async (page, blog, open = true) => {
  if (open) await page.getByRole("button", { name: "New Blog" }).click();

  await page.getByPlaceholder("title").fill(blog.title);
  await page.getByPlaceholder("author").fill(blog.author);
  await page.getByPlaceholder("url").fill(blog.url);
  await page.getByPlaceholder("likes").fill(blog.likes.toString());

  await page.getByRole("button", { name: "Create" }).click();
};

export {
  loginWith,
  createNewBlog,
  newUser,
  anotherUser,
  newBlog,
  anotherBlog,
  thirdBlog,
  forthBlog,
};
