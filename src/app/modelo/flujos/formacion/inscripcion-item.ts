export interface InscripcionItem {
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
