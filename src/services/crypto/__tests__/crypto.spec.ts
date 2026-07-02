import { describe, expect, it } from 'vitest'
import forge from 'node-forge'
import { generateRsaKeyPair, RSA_KEY_SIZE_BITS } from '../keyPairGenerator'
import { decryptPrivateKeyFromDer, encryptPrivateKeyToDer } from '../privateKeyProtector'
import { buildSealRequestDer, buildSignatureRequestDer } from '../certificateRequestBuilder'
import { derBytesToAsn1 } from '../encoding'

describe('generateRsaKeyPair', () => {
  it('genera un par de llaves RSA de 2048 bits', async () => {
    const keyPair = await generateRsaKeyPair()
    expect(keyPair.privateKey.n.bitLength()).toBe(RSA_KEY_SIZE_BITS)
    expect(keyPair.publicKey.n.compareTo(keyPair.privateKey.n)).toBe(0)
  }, 30_000)
})

describe('protección de la llave privada', () => {
  it('cifra y descifra la llave con la contraseña correcta', async () => {
    const keyPair = await generateRsaKeyPair()
    const encrypted = encryptPrivateKeyToDer(keyPair.privateKey, 'MiContraseña123')
    const decrypted = decryptPrivateKeyFromDer(encrypted, 'MiContraseña123')
    expect(decrypted.n.compareTo(keyPair.privateKey.n)).toBe(0)
  }, 30_000)

  it('rechaza una contraseña incorrecta', async () => {
    const keyPair = await generateRsaKeyPair()
    const encrypted = encryptPrivateKeyToDer(keyPair.privateKey, 'MiContraseña123')
    expect(() => decryptPrivateKeyFromDer(encrypted, 'otra-contraseña')).toThrow(
      'errors.privateKey.wrongPassword',
    )
  }, 30_000)
})

describe('solicitudes PKCS#10', () => {
  it('genera un requerimiento de e.firma verificable con el RFC en el sujeto', async () => {
    const keyPair = await generateRsaKeyPair()
    const requestDer = buildSignatureRequestDer(keyPair, {
      rfc: 'GODE561231GR8',
      curp: 'GODE561231HDFNRN09',
      email: 'contribuyente@example.com',
    })

    const csr = forge.pki.certificationRequestFromAsn1(derBytesToAsn1(requestDer))
    expect(csr.verify()).toBe(true)
    const rfcField = csr.subject.getField({ type: '2.5.4.45' })
    expect(rfcField?.value).toBe('GODE561231GR8')
    const curpField = csr.subject.getField({ type: '2.5.4.5' })
    expect(curpField?.value).toBe('GODE561231HDFNRN09')
  }, 30_000)

  it('genera una solicitud de sello digital con el nombre de la sucursal', async () => {
    const keyPair = await generateRsaKeyPair()
    const requestDer = buildSealRequestDer(keyPair, {
      rfc: 'EKU9003173C9',
      branchName: 'Matriz',
    })

    const csr = forge.pki.certificationRequestFromAsn1(derBytesToAsn1(requestDer))
    expect(csr.verify()).toBe(true)
    expect(csr.subject.getField('CN')?.value).toBe('Matriz')
  }, 30_000)
})
