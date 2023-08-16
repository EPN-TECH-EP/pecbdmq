export interface ProSemestreEstudianteDto{
  codSemestreEstudiante: number
  codSemestre: number
  codDatosPersonales:number
  nombreSemestre: String
  nombreDatosPersonales: String
  }
  export  interface ProSemestreEstudianteCreateUpdateDto{
  codSemestreEstudiante: number
    codSemestre: number
    codDatosPersonales: number
  }
  export const defaultSemestreEstudiante: ProSemestreEstudianteDto={
    codSemestreEstudiante: 0,
    codSemestre: 0,
    codDatosPersonales:0,
    nombreSemestre: '',
    nombreDatosPersonales: ''
  }
