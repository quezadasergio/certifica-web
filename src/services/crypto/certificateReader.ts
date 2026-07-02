import forge from 'node-forge'
import type { CertificateInfo } from '@/types/certifica'
import { derBytesToAsn1 } from './encoding'

const OID_UNIQUE_IDENTIFIER = '2.5.4.45'
const OID_SERIAL_NUMBER = '2.5.4.5'

export interface ParsedCertificate {
  certificate: forge.pki.Certificate
  info: CertificateInfo
}

function findSubjectValue(certificate: forge.pki.Certificate, type: string): string {
  const field = certificate.subject.getField({ type })
  return typeof field?.value === 'string' ? field.value : ''
}

/**
 * El número de serie de los certificados del SAT viene codificado como texto
 * ASCII en hexadecimal; se decodifica para mostrarlo tal como lo hacía la
 * aplicación de escritorio.
 */
function decodeSatSerialNumber(hexSerial: string): string {
  const normalized = hexSerial.replace(/^0+(?=\d)/, '')
  const decoded = normalized.replace(/(3[0-9])/g, (pair) =>
    String.fromCharCode(Number.parseInt(pair, 16)),
  )
  return /^\d+$/.test(decoded) ? decoded : hexSerial
}

/** Lee un certificado X.509 en DER (.cer) o PEM y extrae su información. */
export function parseCertificate(fileBytes: Uint8Array): ParsedCertificate {
  let certificate: forge.pki.Certificate
  try {
    const text = new TextDecoder().decode(fileBytes)
    if (text.includes('-----BEGIN CERTIFICATE-----')) {
      certificate = forge.pki.certificateFromPem(text)
    } else {
      certificate = forge.pki.certificateFromAsn1(derBytesToAsn1(fileBytes))
    }
  } catch {
    throw new Error('errors.certificate.invalid')
  }

  const commonNameField = certificate.subject.getField('CN')
  const issuerCommonNameField = certificate.issuer.getField('CN')
  const validFrom = certificate.validity.notBefore
  const validTo = certificate.validity.notAfter

  return {
    certificate,
    info: {
      serialNumber: decodeSatSerialNumber(certificate.serialNumber),
      subjectName: typeof commonNameField?.value === 'string' ? commonNameField.value : '',
      rfc: findSubjectValue(certificate, OID_UNIQUE_IDENTIFIER).split('/')[0]!.trim(),
      curp: findSubjectValue(certificate, OID_SERIAL_NUMBER).trim(),
      issuerName:
        typeof issuerCommonNameField?.value === 'string' ? issuerCommonNameField.value : '',
      validFrom,
      validTo,
      isExpired: validTo.getTime() < Date.now(),
    },
  }
}

/**
 * Verifica que una llave privada corresponda al certificado dado
 * comparando el módulo RSA de ambas llaves.
 */
export function privateKeyMatchesCertificate(
  privateKey: forge.pki.rsa.PrivateKey,
  certificate: forge.pki.Certificate,
): boolean {
  const certificatePublicKey = certificate.publicKey as forge.pki.rsa.PublicKey
  return privateKey.n.compareTo(certificatePublicKey.n) === 0
}
