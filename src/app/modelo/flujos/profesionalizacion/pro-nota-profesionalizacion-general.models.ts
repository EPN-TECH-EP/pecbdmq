import {DocumentoFormacion} from "../formacion/documento";

export class ProNotaProfesionalizacionGeneralDto {
  fecha: string
  codigo: number
  codMateriaParalelo: number
  documentos: DocumentoFormacion[]
}


export class ProNotaProfesionalizacionGeneralCreateUpdateDto {
  fecha: string
  codigo: number
  codMateriaParalelo: number
}

export class ProNotaProfesionalizacionDto {
  codNotaProfesionalizacion: number
  codEstudianteSemestreMateriaParalelo: number
  nombreParalelo: string
  codEstudiante: number
  nombre: string
  apellido: string
  correoPersonal: string
  codDatosPersonales: number
  notaParcial1: number
  notaParcial2: number
  notaPractica: number
  notaAsistencia: number
  codInstructor: number
  codMateria: number
  codSemestre: number
  notaMinima: number
  pesoMateria: number
  numeroHoras: number
  notaMateria: number
  notaPonderacion: number
  notaDisciplina: number
  notaSupletorio: number
  nombrePeriodo: string
  nombreSemestre: string
  nombreMateria: string
  nombreProyecto: string
}
