import forge from 'node-forge'
import { derBytesToAsn1 } from './encoding'

export const RSA_KEY_SIZE_BITS = 2048

export interface RsaKeyPair {
  privateKey: forge.pki.rsa.PrivateKey
  publicKey: forge.pki.rsa.PublicKey
}

/**
 * Genera un par de llaves RSA de 2048 bits usando la Web Crypto API del
 * navegador (mucho más rápida que generar los primos en JavaScript) y lo
 * convierte a llaves de node-forge para poder firmar solicitudes PKCS#10.
 */
export async function generateRsaKeyPair(): Promise<RsaKeyPair> {
  const webCryptoKeyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: RSA_KEY_SIZE_BITS,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )

  const pkcs8Der = new Uint8Array(await crypto.subtle.exportKey('pkcs8', webCryptoKeyPair.privateKey))
  const privateKey = forge.pki.privateKeyFromAsn1(derBytesToAsn1(pkcs8Der)) as forge.pki.rsa.PrivateKey
  const publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e)

  return { privateKey, publicKey }
}
