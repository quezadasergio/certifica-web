import forge from 'node-forge'
import { asn1ToDerBytes, derBytesToAsn1 } from './encoding'

/**
 * Protege una llave privada con contraseña y la devuelve en formato DER
 * PKCS#8 cifrado, el mismo formato de los archivos `.key` que produce la
 * aplicación Certifica del SAT (PBE con 3DES).
 */
export function encryptPrivateKeyToDer(
  privateKey: forge.pki.rsa.PrivateKey,
  password: string,
): Uint8Array {
  const rsaPrivateKeyAsn1 = forge.pki.privateKeyToAsn1(privateKey)
  const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKeyAsn1)
  const encryptedInfo = forge.pki.encryptPrivateKeyInfo(privateKeyInfo, password, {
    algorithm: '3des',
  })
  return asn1ToDerBytes(encryptedInfo)
}

/**
 * Descifra un archivo `.key` (DER PKCS#8 cifrado) con su contraseña.
 * Lanza un error si la contraseña es incorrecta o el archivo no es válido.
 */
export function decryptPrivateKeyFromDer(
  encryptedKeyDer: Uint8Array,
  password: string,
): forge.pki.rsa.PrivateKey {
  let encryptedAsn1: forge.asn1.Asn1
  try {
    encryptedAsn1 = derBytesToAsn1(encryptedKeyDer)
  } catch {
    throw new Error('errors.privateKey.invalid')
  }

  let privateKeyInfo: forge.asn1.Asn1 | null
  try {
    privateKeyInfo = forge.pki.decryptPrivateKeyInfo(encryptedAsn1, password)
  } catch {
    throw new Error('errors.privateKey.wrongPassword')
  }
  if (!privateKeyInfo) {
    throw new Error('errors.privateKey.wrongPassword')
  }
  return forge.pki.privateKeyFromAsn1(privateKeyInfo) as forge.pki.rsa.PrivateKey
}
