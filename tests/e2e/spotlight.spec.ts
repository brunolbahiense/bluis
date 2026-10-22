import { expect, test } from '@playwright/test'

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

test.describe('Spotlight', () => {
  test('abre pelo atalho, busca, responde e fecha', async ({ page }) => {
    await page.goto('/pt')
    await page.keyboard.press('ControlOrMeta+k')

    const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
    await expect(dialog).toBeVisible()

    const search = dialog.getByRole('combobox')
    await search.fill('testes')
    await expect(dialog.getByRole('option').first()).toContainText(
      'Como você garante qualidade?'
    )

    await search.press('Enter')
    await expect(dialog.getByText('Qualidade é processo').first()).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(search).toBeFocused()
    await expect(dialog.getByRole('option').first()).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('setas mudam a seleção', async ({ page }) => {
    await page.goto('/pt')
    await page
      .getByRole('button', { name: /Pergunte algo ou busque uma seção/ })
      .click()
    const options = page.getByRole('dialog').getByRole('option')
    await expect(options.first()).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowDown')
    await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true')
  })

  test('copiar e-mail mostra confirmação', async ({ page }) => {
    await page.goto('/pt')
    await page.keyboard.press('ControlOrMeta+k')
    await page.getByRole('combobox').fill('copiar')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toHaveText('E-mail copiado ✓')
  })

  test('busca sem resultado oferece o e-mail', async ({ page }) => {
    await page.goto('/pt')
    await page.keyboard.press('ControlOrMeta+k')
    await page.getByRole('combobox').fill('kubernetes')
    await expect(page.getByText('Não encontrei isso aqui')).toBeVisible()
    await expect(page.getByRole('option').first()).toContainText(
      'Copiar e-mail'
    )
  })

  test('dica do hero abre com a busca preenchida', async ({ page }) => {
    await page.goto('/pt')
    await page.getByRole('button', { name: '“O que você faz com IA?”' }).click()
    await expect(page.getByRole('combobox')).toHaveValue(
      'O que você faz com IA?'
    )
  })
})
