import { describe, expect, it } from 'vitest'
import {
  isPersonaMoral,
  validateCurp,
  validateEmail,
  validateRfc,
} from '../personValidation'

describe('validateRfc', () => {
  it('acepta un RFC de persona física válido', () => {
    expect(validateRfc('GODE561231GR8').valid).toBe(true)
  })

  it('acepta un RFC de persona moral válido', () => {
    expect(validateRfc('EKU9003173C9').valid).toBe(true)
  })

  it('acepta RFC en minúsculas normalizándolo', () => {
    expect(validateRfc('gode561231gr8').valid).toBe(true)
  })

  it('rechaza un RFC vacío', () => {
    expect(validateRfc('').messageKey).toBe('validation.rfc.required')
  })

  it('rechaza un RFC con longitud incorrecta', () => {
    expect(validateRfc('GODE56').messageKey).toBe('validation.rfc.length')
  })

  it('rechaza un RFC con fecha inválida', () => {
    expect(validateRfc('GODE561341GR8').messageKey).toBe('validation.rfc.date')
  })
})

describe('isPersonaMoral', () => {
  it('detecta persona moral por longitud de 12 caracteres', () => {
    expect(isPersonaMoral('EKU9003173C9')).toBe(true)
    expect(isPersonaMoral('GODE561231GR8')).toBe(false)
  })
})

describe('validateCurp', () => {
  it('acepta una CURP válida', () => {
    expect(validateCurp('GODE561231HDFNRN09').valid).toBe(true)
  })

  it('rechaza una CURP con formato incorrecto', () => {
    expect(validateCurp('GODE561231XXXXXXXX').messageKey).toBe('validation.curp.format')
  })

  it('rechaza una CURP vacía', () => {
    expect(validateCurp('').messageKey).toBe('validation.curp.required')
  })
})

describe('validateEmail', () => {
  it('acepta un correo válido', () => {
    expect(validateEmail('contribuyente@example.com').valid).toBe(true)
  })

  it('rechaza un correo sin dominio', () => {
    expect(validateEmail('contribuyente@').messageKey).toBe('validation.email.format')
  })

  it('rechaza un correo vacío', () => {
    expect(validateEmail('').messageKey).toBe('validation.email.required')
  })
})
