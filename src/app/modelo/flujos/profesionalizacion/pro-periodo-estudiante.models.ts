
export interface ProPeriodoEstudianteDto{
  codPeriodoEstudiante:number
  codPeriodo: number
  codEstudiante: number
  nombrePeriodo: string
  nombre: string
  apellido:string
  correoPersonal:string
  cedula:string
  codDatosPersonales: number
}

export interface ProPeriodoEstudianteCreateUpdateDto{
  codPeriodo: number
  codDatosPersonales: number
  codPeriodoEstudiante:number

}
export const defaultPeriodoEstudiante: ProPeriodoEstudianteDto = {
  codPeriodoEstudiante:0,
  codPeriodo: 0,
  codEstudiante: 0,
  nombrePeriodo: '',
  nombre: '',
  apellido:'',
  correoPersonal:'',
  cedula:'',
  codDatosPersonales: 0
}
