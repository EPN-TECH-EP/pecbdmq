export interface EspecializacionEstudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  codigoUnicoEstudiante: string;
  nombreCargo: string;
  nombreRango: string;
  nombreGrado: string;
  nombreTipoInstructor: string;
  instructor: string;
  nombreAula: string;
  nombreTipo: string;
  nombreCatalogo: string;
  fechaInicioCurso: Date;
  fechaFinCurso: Date;
  fechaInicioCarga: Date;
  fechaFinCarga: Date;
  estadoProceso: string;
  fechaCreaNota: Date;
  horaCreaNota: string;
  usuarioModificacion: string;
  fechaModNota: Date;
  horaModNota: string;
  notaFinal: number;
  resultado: boolean;
}
