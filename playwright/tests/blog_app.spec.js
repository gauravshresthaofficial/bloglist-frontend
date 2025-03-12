const { test, describe, expect, beforeEach } = require("@playwright/test");
const {
  loginWith,
  createNewBlog,
  newUser,
  newBlog,
  anotherUser,
  anotherBlog,
  thirdBlog,
  forthBlog,
} = require("./helper");

// Helper function to reset the backend and create a new user
async function resetAndSetupUser(request) {
  await request.post("http://localhost:3003/api/testing/reset");
  await request.post("http://localhost:3003/api/users", {
    data: {
      username: newUser.username,
      name: newUser.name,
      password: newUser.password,
    },
  });
}

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await resetAndSetupUser(request);
    await page.goto("http://localhost:5173/");
  });

  test("login form is shown", async ({ page }) => {
    await expect(page.getByText("Login to the application")).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, newUser.username, newUser.password);
      await expect(
        page.getByText(`${newUser.username} logged in`)
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, newUser.username, "wrongpassword");
      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("Blog operations", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, newUser.username, newUser.password);
    });

    test("a new blog can be created", async ({ page }) => {
      await createNewBlog(page, newBlog);
      await expect(
        page.getByText(`New Blog added by ${newUser.username}`)
      ).toBeVisible();
      await page.getByRole("button", { name: "View" }).click();
      await expect(
        page.getByText(`${newBlog.title} ${newBlog.author}`)
      ).toBeVisible();
    });

    test("like count increases when the user clicks the like button", async ({
      page,
    }) => {
      await createNewBlog(page, newBlog);
      await page.getByRole("button", { name: "View" }).click();
      await page.getByRole("button", { name: "Like" }).click();
      await expect(page.getByText(newBlog.likes + 1)).toBeVisible();
    });

    test("delete a blog", async ({ page }) => {
      await createNewBlog(page, newBlog);
      await page.getByRole("button", { name: "View" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Delete" }).click();
      await expect(
        page.getByText(`${newBlog.title} ${newBlog.author}`)
      ).not.toBeVisible();
    });

    test("only the user who added the blog sees the blog's delete button", async ({
      page,
      request,
    }) => {
      await createNewBlog(page, newBlog);
      await page.getByRole("button", { name: "Log Out" }).click();
      await expect(page.getByText("Login to the application")).toBeVisible();
      await request.post("http://localhost:3003/api/users", {
        data: {
          username: anotherUser.username,
          name: anotherUser.name,
          password: anotherUser.password,
        },
      });
      await loginWith(page, anotherUser.username, anotherUser.password);
      await page.getByRole("button", { name: "View" }).click();
      await expect(
        page.getByRole("button", { name: "Delete" })
      ).not.toBeVisible();
    });

    test("blogs are arranged in the order according to the likes", async ({
      page,
    }) => {
      await createNewBlog(page, newBlog);
      await createNewBlog(page, anotherBlog, false);
      await createNewBlog(page, thirdBlog, false);
      await createNewBlog(page, forthBlog, false);

      const blog1 = page
        .locator(".blog")
        .filter({ hasText: `${newBlog.title} ${newBlog.author}` });
      const blog2 = page
        .locator(".blog")
        .filter({ hasText: `${anotherBlog.title} ${anotherBlog.author}` });
      const blog3 = page
        .locator(".blog")
        .filter({ hasText: `${thirdBlog.title} ${thirdBlog.author}` });
      const blog4 = page
        .locator(".blog")
        .filter({ hasText: `${forthBlog.title} ${forthBlog.author}` });

      await blog1.getByRole("button", { name: "View" }).click();
      await blog2.getByRole("button", { name: "View" }).click();
      await blog3.getByRole("button", { name: "View" }).click();
      await blog4.getByRole("button", { name: "View" }).click();

      await blog1.getByRole("button", { name: "Like" }).click();
      await blog1.getByRole("button", { name: "Like" }).click();
      await blog2.getByRole("button", { name: "Like" }).click();
      await blog2.getByRole("button", { name: "Like" }).click();
      await blog2.getByRole("button", { name: "Like" }).click();
      await blog4.getByRole("button", { name: "Like" }).click();

      const blogs = await page.locator(".blog").all();
      expect(await blogs[0].innerText()).toContain(
        `${anotherBlog.title} ${anotherBlog.author}`
      );
      expect(await blogs[1].innerText()).toContain(
        `${newBlog.title} ${newBlog.author}`
      );
      expect(await blogs[2].innerText()).toContain(
        `${forthBlog.title} ${forthBlog.author}`
      );
      expect(await blogs[3].innerText()).toContain(
        `${thirdBlog.title} ${thirdBlog.author}`
      );
    });
  });
});
