import { expect, test } from '@playwright/test'

test.describe('com animações reduzidas', () => {
  test.use({ reducedMotion: 'reduce' })

  test('LiveBuild fica estático e as métricas mostram o valor final', async ({
    page
  }) => {
    await page.goto('/pt')
    await expect(page.locator('[data-live-build]')).toHaveAttribute(
      'data-static',
      'true'
    )
    await expect(page.getByText('15+', { exact: true })).toBeVisible()
  })
})

test('LiveBuild troca de cena ao clicar', async ({ page }) => {
  // Congela o relógio antes de navegar: o temporizador interno que avança as cenas
  // sozinho não dispara, então só o clique muda a cena (teste determinístico).
  await page.clock.install()
  await page.goto('/pt')
  const panel = page.locator('[data-live-build]')
  await expect(panel).toHaveAttribute('data-theme', 'coral')
  await panel.click()
  await expect(panel).toHaveAttribute('data-theme', 'ink')
})
