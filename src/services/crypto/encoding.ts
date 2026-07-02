import forge from 'node-forge'

/** Convierte bytes a la representación de "binary string" que usa node-forge. */
export function bytesToBinaryString(bytes: Uint8Array): string {
  return forge.util.binary.raw.encode(bytes)
}

/** Convierte un "binary string" de node-forge a bytes. */
export function binaryStringToBytes(binary: string): Uint8Array {
  return forge.util.binary.raw.decode(binary)
}

/** Serializa una estructura ASN.1 de node-forge a bytes DER. */
export function asn1ToDerBytes(asn1Object: forge.asn1.Asn1): Uint8Array {
  return binaryStringToBytes(forge.asn1.toDer(asn1Object).getBytes())
}

/** Interpreta bytes DER como una estructura ASN.1 de node-forge. */
export function derBytesToAsn1(derBytes: Uint8Array): forge.asn1.Asn1 {
  return forge.asn1.fromDer(bytesToBinaryString(derBytes))
}

/** Codifica bytes en Base64. */
export function bytesToBase64(bytes: Uint8Array): string {
  return forge.util.encode64(bytesToBinaryString(bytes))
}
