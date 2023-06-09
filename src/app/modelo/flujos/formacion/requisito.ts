export interface ValidacionRequisito {
  codValidacion: number,
  codRequisitos: number,
  codPostulante: number,
  nombreRequisito: string,
  estado: boolean,
  observaciones: string | null
  estadoMuestra: boolean | null,
  observacionMuestra: string | null
}
