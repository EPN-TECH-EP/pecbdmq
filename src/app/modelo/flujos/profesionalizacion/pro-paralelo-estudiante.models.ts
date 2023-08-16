export class ProParaleloEstudianteDto {
  codParaleloEstudiante: number
  codSemestreMateriaParalelo: number
  nombreParalelo: string
  codEstudiante: number
  nombre: string
  apellido: string
  correoPersonal: string
  codDatosPersonales: number
  cedula: string
}


export class ProParaleloEstudianteCreateUpdateDto {
  codParaleloEstudiante: number
  codSemestreMateriaParalelo: number
  codEstudiante: number
}

export const defaultParaleloEstuduante: ProParaleloEstudianteDto = {
  codParaleloEstudiante: 0,
  codSemestreMateriaParalelo: 0,
  nombreParalelo: '',
  codEstudiante: 0,
  nombre: '',
  apellido: '',
  correoPersonal: '',
  codDatosPersonales: 0,
  cedula: ''
}
