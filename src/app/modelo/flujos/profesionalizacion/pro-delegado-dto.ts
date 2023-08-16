export interface ProDelegadoDto {
  codDelegado: number,
  codUsuario: number,
  cedula: string,
  nombre: string,
  apellido: string,
  correoPersonal: string,
  codDatosPersonales: number
}

export interface ProDelegadoCreateUpdateDto {
  codDelegado: number,
  codPeriodoAcademico: number,
  codUsuario: number

}

export const defaultProDelegado: ProDelegadoDto = {
  codDelegado: 0,
  codUsuario: 0,
  cedula: "",
  nombre: "",
  apellido: "",
  correoPersonal: "",
  codDatosPersonales: 0
}
