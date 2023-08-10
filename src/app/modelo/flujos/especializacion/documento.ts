export interface DocumentoEspecializacion {
  codInscripcionDocumento: number
  codInscripcion: number
  documento: Documento
}

export interface Documento {
  codDocumento: number
  tipo: string
  descripcion: string
  nombre: string
  observaciones: string
  ruta: string
  estado: string
  autorizacion: string
  estadoValidacion: string
}
