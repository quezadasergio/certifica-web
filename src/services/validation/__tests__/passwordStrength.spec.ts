import { describe, expect, it } from 'vitest'
import {
  evaluatePasswordStrength,
  validatePassword,
} from '../passwordStrength'

describe('validatePassword', () => {
  it('rechaza contraseñas vacías', () => {
    expect(validatePassword('').messageKey).toBe('validation.password.required')
  })

  it('rechaza contraseñas de menos de 8 caracteres', () => {
    expect(validatePassword('abc1234').messageKey).toBe('validation.password.minLength')
  })

  it('acepta contraseñas de 8 o más caracteres', () => {
    expect(validatePassword('abcd1234').valid).toBe(true)
  })
})

describe('evaluatePasswordStrength', () => {
  it('califica como débil una contraseña corta y simple', () => {
    const strength = evaluatePasswordStrength('abc')
    expect(['muy-debil', 'debil']).toContain(strength.level)
  })

  it('califica como fuerte una contraseña larga y variada', () => {
    const strength = evaluatePasswordStrength('C0ntr@seña-Segura!2024')
    expect(['fuerte', 'muy-fuerte']).toContain(strength.level)
  })
})
