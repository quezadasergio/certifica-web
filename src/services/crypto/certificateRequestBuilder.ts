import forge from 'node-forge'
import type { RsaKeyPair } from './keyPairGenerator'
import { asn1ToDerBytes } from './encoding'

/** OIDs de atributos del nombre distinguido usados por el SAT. */
const OID_UNIQUE_IDENTIFIER = '2.5.4.45'
const OID_SERIAL_NUMBER = '2.5.4.5'

export interface SignatureRequestSubject {
  rfc: string
  curp: string
  email: string
  legalRepresentativeRfc?: string
}

export interface SealRequestSubject {
  rfc: string
  branchName: string
}

type SubjectAttribute = {
  type?: string
  name?: string
  value: string
  valueTagClass?: number
}

function buildCertificationRequestDer(
  keyPair: RsaKeyPair,
  subjectAttributes: SubjectAttribute[],
): Uint8Array {
  const csr = forge.pki.createCertificationRequest()
  csr.publicKey = keyPair.publicKey
  csr.setSubject(subjectAttributes as forge.pki.CertificateField[])
  csr.sign(keyPair.privateKey, forge.md.sha1.create()) // SHA1withRSA, igual que Certifica.jar
  return asn1ToDerBytes(forge.pki.certificationRequestToAsn1(csr))
}

/**
 * Construye la solicitud PKCS#10 (.req) para un requerimiento de e.firma.
 * El sujeto incluye el RFC (x500UniqueIdentifier), la CURP (serialNumber)
 * y el correo electrónico, igual que la aplicación de escritorio.
 */
export function buildSignatureRequestDer(
  keyPair: RsaKeyPair,
  subject: SignatureRequestSubject,
): Uint8Array {
  const rfcValue = subject.legalRepresentativeRfc
    ? `${subject.rfc} / ${subject.legalRepresentativeRfc}`
    : subject.rfc

  return buildCertificationRequestDer(keyPair, [
    { type: OID_UNIQUE_IDENTIFIER, value: rfcValue },
    { type: OID_SERIAL_NUMBER, value: subject.curp },
    { name: 'emailAddress', value: subject.email },
  ])
}

/**
 * Construye la solicitud PKCS#10 para un Certificado de Sello Digital (CSD).
 * El sujeto incluye el nombre de la sucursal (CN/OU) y el RFC del contribuyente.
 */
export function buildSealRequestDer(keyPair: RsaKeyPair, subject: SealRequestSubject): Uint8Array {
  return buildCertificationRequestDer(keyPair, [
    { name: 'commonName', value: subject.branchName },
    { name: 'organizationalUnitName', value: subject.branchName },
    { type: OID_UNIQUE_IDENTIFIER, value: subject.rfc },
  ])
}
