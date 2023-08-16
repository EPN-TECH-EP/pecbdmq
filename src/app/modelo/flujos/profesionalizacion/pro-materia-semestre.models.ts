export interface ProMateriaSemestreDto {
  codMateriaSemestre: number
  codPeriodoSemestre: number
  codMateria: number
  codAula: number
  nombrePeriodo: String
  nombreMateria: String
  nombreSemestre: String
  nombreAula: String
  numeroHoras: number
  notaMinima: number
  notaMaxima: number
  esProyecto: boolean
}

export interface ProMateriaSemestreCreateUpdateDto {
  codMateriaSemestre: number
  codPeriodoSemestre: number
  codMateria: number
  codAula: number
  numeroHoras: number
  notaMinima: number
  notaMaxima: number
}

export const defaultMateriaSemestre: ProMateriaSemestreDto = {
  codMateriaSemestre: 0,
  codPeriodoSemestre: 0,
  codMateria: 0,
  codAula: 0,
  nombrePeriodo: '',
  nombreMateria: '',
  nombreSemestre: '',
  nombreAula: '',
  numeroHoras: 0,
  notaMinima: 0,
  notaMaxima: 0,
  esProyecto: false
}
