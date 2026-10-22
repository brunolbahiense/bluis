import { expect, test } from '@playwright/test'

test.describe('idioma por rota', () => {
  test('navegador em inglês vai para /en', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'accept-language': 'en-US,en;q=0.9' }
    })
    expect(response.status()).toBe(307)
    expect(response.headers()['location']).toMatch(/\/en$/)
  })

  test('sem Accept-Language vai para /pt', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'accept-language': '' }
    })
    expect(response.status()).toBe(307)
    expect(response.headers()['location']).toMatch(/\/pt$/)
  })

  test('cookie de idioma vence o Accept-Language', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'accept-language': 'pt-BR', cookie: 'locale=en' }
    })
    expect(response.headers()['location']).toMatch(/\/en$/)
  })

  test('caminho desconhecido termina em 404', async ({ request }) => {
    const response = await request.get('/xx')
    expect(response.status()).toBe(404)
  })

  test('/en já vem em inglês do servidor', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'I build products with AI'
    )
  })

  test('o seletor troca para o outro idioma', async ({ page }) => {
    await page.goto('/pt')
    await page.getByRole('link', { name: /View in English/ }).click()
    await expect(page).toHaveURL(/\/en$/)
  })
})
