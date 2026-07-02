/** Datos del solicitante para un requerimiento de e.firma. */
export interface SignatureApplicant {
  rfc: string
  curp: string
  email: string
  /** RFC del representante legal, opcional. */
  legalRepresentativeRfc?: string
}

/** Datos de una sucursal/unidad para una solicitud de sello digital (CSD). */
export interface SealBranch {
  /** Nombre de la sucursal o unidad, p. ej. "Matriz". */
  name: string
  password: string
}

/** Información legible de un certificado X.509 (.cer). */
export interface CertificateInfo {
  serialNumber: string
  subjectName: string
  rfc: string
  curp: string
  issuerName: string
  validFrom: Date
  validTo: Date
  isExpired: boolean
}

/** Archivo generado listo para descargarse en el navegador. */
export interface GeneratedFile {
  fileName: string
  bytes: Uint8Array
  descriptionKey: string
  descriptionParams?: Record<string, string>
}
