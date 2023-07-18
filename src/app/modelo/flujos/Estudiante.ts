import { Paralelo } from "../admin/paralelo";

export interface Estudiante {
  codEstudiante: number;
  codUnico: string;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  codDatosPersonales: number;
  codUsuario: number;
  paralelo?: Paralelo;
}

export const ESTUDIANTE_VACIO: Estudiante = {
  codEstudiante: null,
  codUnico: null,
  nombre: null,
  apellido: null,
  cedula: null,
  correo: null,
  telefono: null,
  codDatosPersonales: null,
  codUsuario: null,
  paralelo: null
}

// export const ESTUDIANTES: Estudiante[] = [
//   {
//     codNota: 1,
//     codUnico: '123456789',
//     nombre: 'Juan',
//     apellido: 'Perez',
//     cedula: '123456789',
//     correo: 'correo@gmail.com',
//     telefono: '0991182474',
//     codDatosPersonales: 1,
//     codUsuario: 1
//   },
//   {
//     codNota: 2,
//     codUnico: '123456789',
//     nombre: 'Maria',
//     apellido: 'Perez',
//     cedula: '123456789',
//     correo: 'correo@gmail.com',
//     telefono: '0991182474',
//     codDatosPersonales: 2,
//     codUsuario: 2
//   },
//   {
//     codNota: 3,
//     codUnico: '123456789',
//     nombre: 'Pedro',
//     apellido: 'Perez',
//     cedula: '123456789',
//     correo: 'correo@gmail.com',
//     telefono: '0991182474',
//     codDatosPersonales: 3,
//     codUsuario: 3
//   }
// ]

export interface NotaPorEstudiante {
  codNota: number;
  codUnicoEstudiante: string;
  nombreCompleto: string;
  cedula: string;
  notaFinal: number;
  notaDisciplina: number;
  notaSupletorio: number;
  codParalelo: number;
  nombreParalelo: string;
}

export interface EstudianteNotaDisciplina {
  codNota: number;
  codUnico: string;
  nombre: string;
  apellido: string;
  cedula: string;
  notaDisciplina: number;
}

export const ESTUDIANTE_NOTA_DISCIPLINA: EstudianteNotaDisciplina[] = [
  {
    codNota: 1,
    codUnico: '123456789',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: '123456789',
    notaDisciplina: 9,
  },
  {
    codNota: 2,
    codUnico: '123456789',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: '123456789',
    notaDisciplina: 10,
  },
  {
    codNota: 3,
    codUnico: '123456789',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: '123456789',
    notaDisciplina: 8,
  },
  {
    codNota: 4,
    codUnico: '123456789',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: '123456789',
    notaDisciplina: 7,
  }
]

export const ESTUDIANTE_NOTA: NotaPorEstudiante[] = [
  {
    codNota: 1,
    codUnicoEstudiante: '123456789',
    nombreCompleto: 'Juan',
    cedula: '123456789',
    notaFinal: 6,
    notaDisciplina: 9,
    notaSupletorio: 10,
    codParalelo: 1,
    nombreParalelo: 'A'
  }, {
    codNota: 2,
    codUnicoEstudiante: '123456789',
    nombreCompleto: 'Juan',
    cedula: '123456789',
    notaFinal: 9,
    notaDisciplina: 10,
    notaSupletorio: 7,
    codParalelo: 1,
    nombreParalelo: 'A'
  }, {
    codNota: 3,
    codUnicoEstudiante: '123456789',
    nombreCompleto: 'Juan',
    cedula: '123456789',
    notaFinal: 6,
    notaDisciplina: 5,
    notaSupletorio: 8,
    nombreParalelo: 'A',
    codParalelo: 1,
  }, {
    codNota: 4,
    codUnicoEstudiante: '123456789',
    nombreCompleto: 'Juan',
    cedula: '123456789',
    notaFinal: 10,
    notaDisciplina: 10,
    notaSupletorio: null,
    codParalelo: 1,
    nombreParalelo: 'A'
  },
]
