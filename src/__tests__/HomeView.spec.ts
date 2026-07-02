import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { i18n } from '../i18n'
import HomeView from '../views/HomeView.vue'

describe('HomeView', () => {
  it('muestra las opciones principales del menú', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })
    const text = wrapper.text()
    expect(text).toContain('Seleccione la opción deseada')
    expect(text).toContain('Requerimiento de generación de firma electrónica')
    expect(text).toContain('Requerimiento de renovación de firma electrónica')
    expect(text).toContain('Solicitud de Certificados de Sello Digital (CSD)')
    expect(text).toContain('Consultar un certificado')
  })
})
