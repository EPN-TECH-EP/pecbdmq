export interface ProParaleloInsructorDto {
    codPeriodoSemestreMateriaParaleloInstructor: number,
    codPeriodoSemestreMateriaParalelo: number,
    codInstructor: number,
    codDatosPersonales: number,
    nombreParalelo: String,
    nombre: String,
    apellido: String,
    correoPersonal: String

}
export interface ProParaleloInsructorCreateUpdateDto {
    codPeriodoSemestreMateriaParaleloInstructor: number,
    codPeriodoSemestreMateriaParalelo: number,
    codInstructor: number,

}

export const defaultParaleloInsructor: ProParaleloInsructorDto = {

    codPeriodoSemestreMateriaParaleloInstructor: 0,
    codPeriodoSemestreMateriaParalelo: 0,
    codInstructor: 0,
    codDatosPersonales: 0,
    nombreParalelo: '',
    nombre: '',
    apellido: '',
    correoPersonal: ''

}
