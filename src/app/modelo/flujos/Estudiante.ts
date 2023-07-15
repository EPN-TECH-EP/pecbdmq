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

export const ESTUDIANTES: Estudiante[] = [
  {
    codEstudiante: 1,
    codUnico: '123456789',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: '123456789',
    correo: 'correo@gmail.com',
    telefono: '0991182474',
    codDatosPersonales: 1,
    codUsuario: 1
  },
  {
    codEstudiante: 2,
    codUnico: '123456789',
    nombre: 'Maria',
    apellido: 'Perez',
    cedula: '123456789',
    correo: 'correo@gmail.com',
    telefono: '0991182474',
    codDatosPersonales: 2,
    codUsuario: 2
  },
  {
    codEstudiante: 3,
    codUnico: '123456789',
    nombre: 'Pedro',
    apellido: 'Perez',
    cedula: '123456789',
    correo: 'correo@gmail.com',
    telefono: '0991182474',
    codDatosPersonales: 3,
    codUsuario: 3
  }
]
