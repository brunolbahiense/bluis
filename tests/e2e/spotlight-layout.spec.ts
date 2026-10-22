import { expect, test, type Page } from '@playwright/test'

const minimumUsefulHeight = 300

async function openSpotlight(page: Page) {
  await page.goto('/pt')
  await page
    .getByRole('button', { name: /Pergunte algo ou busque uma seção/ })
    .click()
  const dialog = page.getByRole('dialog', { name: 'Buscar no site' })
  await expect(dialog).toBeVisible()
  return dialog
}

test.describe('layout do Spotlight', () => {
  test('abre com altura útil, rodapé visível e lista rolando por dentro', async ({
    page
  }) => {
    await page.setViewportSize({ width: 1000, height: 574 })
    const dialog = await openSpotlight(page)

    const dialogBox = await dialog.boundingBox()
    expect(dialogBox?.height ?? 0).toBeGreaterThan(minimumUsefulHeight)
    await expect(
      dialog.getByText('busca no conteúdo deste site')
    ).toBeInViewport()

    const listScrolls = await page
      .getByRole('listbox')
      .evaluate((list) => list.scrollHeight > list.clientHeight)
    expect(listScrolls).toBe(true)
  })

  // Alguns navegadores resolvem flex-basis em porcentagem como 0px quando a altura do
  // contêiner é indefinida. O painel não pode depender disso para ter altura.
  test('não colapsa num motor que resolve flex-basis em % como 0px', async ({
    page
  }) => {
    const dialog = await openSpotlight(page)
    await dialog.evaluate((element) => {
      for (const descendant of element.querySelectorAll<HTMLElement>('*')) {
        if (getComputedStyle(descendant).flexBasis.endsWith('%')) {
          descendant.style.flexBasis = '0px'
        }
      }
    })

    const dialogBox = await dialog.boundingBox()
    expect(dialogBox?.height ?? 0).toBeGreaterThan(minimumUsefulHeight)
    await expect(dialog.getByRole('combobox')).toBeInViewport()
  })
})
