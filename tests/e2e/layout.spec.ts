import { expect, test } from '@playwright/test'

test('sem rolagem horizontal', async ({ page }) => {
  await page.goto('/pt')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
