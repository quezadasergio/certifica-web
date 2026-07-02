import type forge from 'node-forge'
import type { GeneratedFile, SealBranch } from '@/types/certifica'
import { generateRsaKeyPair } from '@/services/crypto/keyPairGenerator'
import { encryptPrivateKeyToDer } from '@/services/crypto/privateKeyProtector'
import { buildSealRequestDer } from '@/services/crypto/certificateRequestBuilder'
import { buildRenewalRequestDer } from '@/services/crypto/renewalRequestBuilder'
import { timestampSuffix } from './fileNaming'

export interface SealRequestResult {
  /** Llave privada y solicitud por cada sucursal. */
  branchFiles: GeneratedFile[]
  /** Paquete firmado (.sdg) con todas las solicitudes, para enviar por CertiSAT. */
  packageFile: GeneratedFile
}

/**
 * Genera la "Solicitud de Certificados de Sello Digital (CSD)": por cada
 * sucursal crea un par de llaves y su solicitud PKCS#10, y arma un paquete
 * firmado con la e.firma vigente del contribuyente.
 */
export async function generateSealRequestFiles(
  rfc: string,
  branches: SealBranch[],
  signingCertificate: forge.pki.Certificate,
  signingPrivateKey: forge.pki.rsa.PrivateKey,
): Promise<SealRequestResult> {
  const normalizedRfc = rfc.trim().toUpperCase()
  const suffix = timestampSuffix()
  const branchFiles: GeneratedFile[] = []
  const requestDers: Uint8Array[] = []

  for (const branch of branches) {
    const keyPair = await generateRsaKeyPair()
    const requestDer = buildSealRequestDer(keyPair, {
      rfc: normalizedRfc,
      branchName: branch.name.trim(),
    })
    requestDers.push(requestDer)

    const safeBranchName = branch.name.trim().replace(/[^\w-]+/g, '_')
    branchFiles.push(
      {
        fileName: `CSD_${safeBranchName}_${normalizedRfc}_${suffix}.key`,
        bytes: encryptPrivateKeyToDer(keyPair.privateKey, branch.password),
        descriptionKey: 'files.seal.privateKey',
        descriptionParams: { branch: branch.name.trim() },
      },
      {
        fileName: `CSD_${safeBranchName}_${normalizedRfc}_${suffix}.req`,
        bytes: requestDer,
        descriptionKey: 'files.seal.request',
        descriptionParams: { branch: branch.name.trim() },
      },
    )
  }

  const totalLength = requestDers.reduce((sum, der) => sum + der.length, 0)
  const concatenatedRequests = new Uint8Array(totalLength)
  let offset = 0
  for (const der of requestDers) {
    concatenatedRequests.set(der, offset)
    offset += der.length
  }

  const packageDer = buildRenewalRequestDer(
    concatenatedRequests,
    signingCertificate,
    signingPrivateKey,
  )

  return {
    branchFiles,
    packageFile: {
      fileName: `CSD_${normalizedRfc}_${suffix}.sdg`,
      bytes: packageDer,
      descriptionKey: 'files.seal.package',
    },
  }
}
