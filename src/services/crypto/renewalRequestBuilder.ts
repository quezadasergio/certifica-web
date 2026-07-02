import forge from 'node-forge'
import { asn1ToDerBytes, bytesToBinaryString } from './encoding'

/**
 * Construye el requerimiento de renovación (.ren): un mensaje PKCS#7 firmado
 * con la e.firma vigente que contiene la nueva solicitud PKCS#10, de modo que
 * el SAT pueda comprobar que quien renueva controla el certificado actual.
 */
export function buildRenewalRequestDer(
  newRequestDer: Uint8Array,
  currentCertificate: forge.pki.Certificate,
  currentPrivateKey: forge.pki.rsa.PrivateKey,
): Uint8Array {
  const signedData = forge.pkcs7.createSignedData()
  signedData.content = forge.util.createBuffer(bytesToBinaryString(newRequestDer))
  signedData.addCertificate(currentCertificate)
  signedData.addSigner({
    key: currentPrivateKey,
    certificate: currentCertificate,
    digestAlgorithm: forge.pki.oids['sha1']!, // DIGEST_SHA1, igual que Certifica.jar
    authenticatedAttributes: [
      { type: forge.pki.oids['contentType']!, value: forge.pki.oids['data']! },
      { type: forge.pki.oids['messageDigest']! },
      { type: forge.pki.oids['signingTime']!, value: new Date() as unknown as string },
    ],
  })
  signedData.sign()
  return asn1ToDerBytes(signedData.toAsn1())
}
