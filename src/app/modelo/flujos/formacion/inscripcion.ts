export interface Inscripcion {
  cedula?:              string;
  nombre?:             string;
  apellido?:           string;
  codDatoPersonal:     number;
  codPeriodoAcademico: number;
  codPostulante:       number;
  codUsuario:          number | null;
  estado:              string;
  idPostulante:        string;
}
