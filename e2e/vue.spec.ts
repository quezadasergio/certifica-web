import { test, expect } from '@playwright/test'

test('muestra el menú principal', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Seleccione la opción deseada')
})

test('navega al requerimiento de firma electrónica', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Requerimiento de generación de firma electrónica').click()
  await expect(page.locator('h1')).toHaveText(
    'Requerimiento de generación de firma electrónica',
  )
})
