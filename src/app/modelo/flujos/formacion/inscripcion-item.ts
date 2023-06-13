export interface InscripcionItem {
  nombreUsuario?:       string;
  correoUsuario?:      string;
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
