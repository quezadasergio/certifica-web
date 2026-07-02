/**
 * Reglas de contraseña equivalentes a las de la aplicación de escritorio:
 * mínimo 8 caracteres, máximo 256, con medidor de nivel de seguridad.
 */

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 256

export type PasswordStrengthLevel = 'muy-debil' | 'debil' | 'aceptable' | 'fuerte' | 'muy-fuerte'

export interface PasswordStrength {
  level: PasswordStrengthLevel
  label: string
  /** Puntuación normalizada entre 0 y 100. */
  score: number
}

export interface PasswordValidation {
  valid: boolean
  messageKey?: string
  messageParams?: Record<string, number>
}

export function validatePassword(password: string): PasswordValidation {
  if (password.length === 0) {
    return { valid: false, messageKey: 'validation.password.required' }
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      messageKey: 'validation.password.minLength',
      messageParams: { min: PASSWORD_MIN_LENGTH },
    }
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      messageKey: 'validation.password.maxLength',
      messageParams: { max: PASSWORD_MAX_LENGTH },
    }
  }
  return { valid: true }
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0
  if (password.length >= PASSWORD_MIN_LENGTH) score += 25
  if (password.length >= 12) score += 15
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 15
  if (/\d/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 20

  if (score >= 85) return { level: 'muy-fuerte', label: 'muy-fuerte', score }
  if (score >= 70) return { level: 'fuerte', label: 'fuerte', score }
  if (score >= 50) return { level: 'aceptable', label: 'aceptable', score }
  if (score >= 25) return { level: 'debil', label: 'debil', score }
  return { level: 'muy-debil', label: 'muy-debil', score }
}
