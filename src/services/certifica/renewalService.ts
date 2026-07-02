import type forge from 'node-forge'
import type { GeneratedFile } from '@/types/certifica'
import type { CertificateInfo } from '@/types/certifica'
import { generateRsaKeyPair } from '@/services/crypto/keyPairGenerator'
import { encryptPrivateKeyToDer } from '@/services/crypto/privateKeyProtector'
import { buildSignatureRequestDer } from '@/services/crypto/certificateRequestBuilder'
import { buildRenewalRequestDer } from '@/services/crypto/renewalRequestBuilder'
import { timestampSuffix } from './fileNaming'

export interface RenewalRequestFiles {
  privateKeyFile: GeneratedFile
  renewalFile: GeneratedFile
}

/**
 * Genera el "Requerimiento de Renovación de Firma Electrónica": una nueva
 * llave privada cifrada (.key) y el archivo de renovación (.ren), que es la
 * nueva solicitud firmada con la e.firma vigente.
 */
export async function generateRenewalFiles(
  certificateInfo: CertificateInfo,
  currentCertificate: forge.pki.Certificate,
  currentPrivateKey: forge.pki.rsa.PrivateKey,
  email: string,
  newPrivateKeyPassword: string,
): Promise<RenewalRequestFiles> {
  const keyPair = await generateRsaKeyPair()
  const rfc = certificateInfo.rfc
  const suffix = timestampSuffix()

  const newRequestDer = buildSignatureRequestDer(keyPair, {
    rfc,
    curp: certificateInfo.curp,
    email: email.trim(),
  })
  const renewalDer = buildRenewalRequestDer(newRequestDer, currentCertificate, currentPrivateKey)

  return {
    privateKeyFile: {
      fileName: `Claveprivada_FIEL_${rfc}_${suffix}.key`,
      bytes: encryptPrivateKeyToDer(keyPair.privateKey, newPrivateKeyPassword),
      descriptionKey: 'files.renewal.privateKey',
    },
    renewalFile: {
      fileName: `Renovacion_FIEL_${rfc}_${suffix}.ren`,
      bytes: renewalDer,
      descriptionKey: 'files.renewal.renewal',
    },
  }
}
