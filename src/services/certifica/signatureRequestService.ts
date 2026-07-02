import type { GeneratedFile, SignatureApplicant } from '@/types/certifica'
import { generateRsaKeyPair } from '@/services/crypto/keyPairGenerator'
import { encryptPrivateKeyToDer } from '@/services/crypto/privateKeyProtector'
import { buildSignatureRequestDer } from '@/services/crypto/certificateRequestBuilder'
import { timestampSuffix } from './fileNaming'

export interface SignatureRequestFiles {
  privateKeyFile: GeneratedFile
  requestFile: GeneratedFile
}

/**
 * Genera los archivos del "Requerimiento de Generación de Firma Electrónica":
 * la llave privada cifrada (.key) y la solicitud PKCS#10 (.req) que se
 * presenta ante el SAT.
 */
export async function generateSignatureRequestFiles(
  applicant: SignatureApplicant,
  privateKeyPassword: string,
): Promise<SignatureRequestFiles> {
  const keyPair = await generateRsaKeyPair()
  const rfc = applicant.rfc.trim().toUpperCase()
  const suffix = timestampSuffix()

  const requestDer = buildSignatureRequestDer(keyPair, {
    rfc,
    curp: applicant.curp.trim().toUpperCase(),
    email: applicant.email.trim(),
    legalRepresentativeRfc: applicant.legalRepresentativeRfc?.trim().toUpperCase() || undefined,
  })
  const encryptedKeyDer = encryptPrivateKeyToDer(keyPair.privateKey, privateKeyPassword)

  return {
    privateKeyFile: {
      fileName: `Claveprivada_FIEL_${rfc}_${suffix}.key`,
      bytes: encryptedKeyDer,
      descriptionKey: 'files.signature.privateKey',
    },
    requestFile: {
      fileName: `Requerimiento_FIEL_${rfc}_${suffix}.req`,
      bytes: requestDer,
      descriptionKey: 'files.signature.request',
    },
  }
}
