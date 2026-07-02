import type { GeneratedFile } from '@/types/certifica'

/** Descarga un archivo generado directamente desde el navegador. */
export function downloadFile(file: GeneratedFile): void {
  const buffer = new ArrayBuffer(file.bytes.length)
  new Uint8Array(buffer).set(file.bytes)
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = file.fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Lee un archivo seleccionado por el usuario como bytes. */
export async function readFileAsBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer())
}
