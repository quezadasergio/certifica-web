/**
 * Validaciones de datos personales usadas por los formularios de la aplicación.
 * Sustituye a las utilerías ofuscadas `mx.sat.gob.f.*` del código Java original.
 */

const RFC_PATTERN = /^([A-ZÑ&]{3,4})(\d{2})(\d{2})(\d{2})([A-Z0-9]{2}[0-9A])$/
const CURP_PATTERN = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/
// Misma expresión regular de correo que usaba la aplicación de escritorio.
const EMAIL_PATTERN = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/

export interface ValidationResult {
  valid: boolean
  messageKey?: string
}

function isValidDatePortion(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return day >= 1 && day <= daysInMonth[month - 1]!
}

/** Valida un RFC de persona física (13 caracteres) o moral (12 caracteres). */
export function validateRfc(rawValue: string): ValidationResult {
  const rfc = rawValue.trim().toUpperCase()
  if (rfc.length === 0) {
    return { valid: false, messageKey: 'validation.rfc.required' }
  }
  if (rfc.length !== 12 && rfc.length !== 13) {
    return { valid: false, messageKey: 'validation.rfc.length' }
  }
  const match = RFC_PATTERN.exec(rfc)
  if (!match) {
    return { valid: false, messageKey: 'validation.rfc.format' }
  }
  const [, initials, year, month, day] = match
  const expectedInitials = rfc.length === 13 ? 4 : 3
  if (initials!.length !== expectedInitials) {
    return { valid: false, messageKey: 'validation.rfc.format' }
  }
  if (!isValidDatePortion(Number(year), Number(month), Number(day))) {
    return { valid: false, messageKey: 'validation.rfc.date' }
  }
  return { valid: true }
}

/** Indica si el RFC corresponde a una persona moral (12 caracteres). */
export function isPersonaMoral(rfc: string): boolean {
  return rfc.trim().length === 12
}

/** Valida una CURP de 18 caracteres. */
export function validateCurp(rawValue: string): ValidationResult {
  const curp = rawValue.trim().toUpperCase()
  if (curp.length === 0) {
    return { valid: false, messageKey: 'validation.curp.required' }
  }
  if (curp.length !== 18 || !CURP_PATTERN.test(curp)) {
    return { valid: false, messageKey: 'validation.curp.format' }
  }
  return { valid: true }
}

/** Valida una dirección de correo electrónico. */
export function validateEmail(rawValue: string): ValidationResult {
  const email = rawValue.trim()
  if (email.length === 0) {
    return { valid: false, messageKey: 'validation.email.required' }
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, messageKey: 'validation.email.format' }
  }
  return { valid: true }
}
