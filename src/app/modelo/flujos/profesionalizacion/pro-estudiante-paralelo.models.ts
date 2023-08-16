export interface ProEstudianteParaleloDto {
    codSemestreMateriaParaleloEstudiante: number,
    codSemestreMateriaParalelo: number,
    codEstudiante: number,
    codMateriaSemestre: number
    codPeriodoSemestre: number
    codMateria: number
    codParalelo: number
    nombrePeriodo: string
    nombreMateria: string
    nombreSemestre: string
    nombreParalelo: string,
    nombre: string,
    apellido: string,
    correoPersonal: string,
    codDatosPersonales: number
}

export interface ProEstudianteParaleloWithNotasDto {
  [key: string]: any;
  codParaleloEstudiante: number,
  codMateriaParalelo: number,
  nombreParalelo: string,
  codEstudiante: number,
  nombre: string,
  apellido: string,
  correoPersonal: string,
  codDatosPersonales: number
}

export interface ProEstudianteParaleloCreateUpdateDto {
    codSemestreMateriaParaleloEstudiante: number,
    codSemestreMateriaParalelo: number,
    codEstudiante: number,
    codMateriaSemestre: number
    codPeriodoSemestre: number
    codMateria: number
    codParalelo: number
}

export const defaultEstudianteParalelo: ProEstudianteParaleloDto = {

    codSemestreMateriaParaleloEstudiante: 0,
    codSemestreMateriaParalelo: 0,
    codEstudiante: 0,
    codMateriaSemestre: 0,
    codPeriodoSemestre: 0,
    codMateria: 0,
    codParalelo: 0,
    nombrePeriodo: '',
    nombreMateria: '',
    nombreSemestre: '',
    nombreParalelo: '',
    nombre: '',
    apellido: '',
    correoPersonal: '',
    codDatosPersonales: 0,



}
