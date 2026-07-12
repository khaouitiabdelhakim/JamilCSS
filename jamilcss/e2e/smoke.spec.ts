import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Utility-first CSS, your way/i)).toBeVisible({ timeout: 15000 });
});

test("theme toggle adds dark class to html", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle theme" }).click({ timeout: 15000 });
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("docs index loads", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByRole("heading", { name: "Introduction", level: 1 })).toBeVisible({
    timeout: 15000,
  });
});

test("no tailwind classes in rendered HTML", async ({ page }) => {
  await page.goto("/");
  const tokens = await page.locator("[class]").evaluateAll((els) =>
    els.flatMap((el) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean))
  );
  const tailwindOnly = tokens.filter(
    (t) =>
      !t.startsWith("j-") &&
      !t.includes(":j-") &&
      !["dark", "light", "antialiased"].includes(t)
  );
  expect(tailwindOnly).toEqual([]);
});
