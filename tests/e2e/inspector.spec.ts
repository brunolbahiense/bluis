import { expect, test } from '@playwright/test'

test('modo Inspecionar mostra componentes e saúde real do build', async ({
  page
}) => {
  await page.goto('/pt')
  await page.keyboard.press('ControlOrMeta+k')
  await page.getByRole('combobox').fill('inspecionar')
  await page.keyboard.press('Enter')

  await expect(page.locator('html')).toHaveAttribute('data-inspecting', '')
  const panel = page.getByRole('complementary', { name: 'Inspecionar' })
  await expect(panel).toBeVisible()
  await expect(panel).toContainText('v2.0.0')
  await expect(panel).toContainText(/\d+\/\d+ passaram/)

  await panel.getByRole('button', { name: 'Fechar' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-inspecting', '')
})
