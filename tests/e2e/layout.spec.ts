import { expect, test } from '@playwright/test'

test('sem rolagem horizontal', async ({ page }) => {
  await page.goto('/pt')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('hero empilha em uma coluna no mobile', async ({ page }) => {
  const viewport = page.viewportSize()
  test.skip(
    (viewport?.width ?? 0) >= 768,
    'o empilhamento só existe abaixo do breakpoint mobile (48rem)'
  )

  await page.goto('/pt')
  const titleBox = await page.getByRole('heading', { level: 1 }).boundingBox()
  const liveBuildBox = await page.locator('[data-live-build]').boundingBox()
  if (!titleBox || !liveBuildBox)
    throw new Error('não foi possível medir o título ou o LiveBuild')

  expect(liveBuildBox.y).toBeGreaterThanOrEqual(titleBox.y + titleBox.height)
})
