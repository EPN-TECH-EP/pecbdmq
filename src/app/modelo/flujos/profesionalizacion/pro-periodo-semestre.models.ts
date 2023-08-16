export interface ProPeriodoSemestreDto {
  codPeriodoSemestre: number
  codPeriodo: number
  codSemestre: number
  nombrePeriodo: String
  nombreSemestre: String

}

export interface ProPeriodoSemestreCreateUpdateDto {
  codPeriodoSemestre: number
  codPeriodo: number
  codSemestre: number
}

export const defaultPeriodoSemestre: ProPeriodoSemestreDto = {
  codPeriodo: 0,
  codPeriodoSemestre: 0,
  codSemestre: 0,
  nombrePeriodo: '',
  nombreSemestre: ''
}
