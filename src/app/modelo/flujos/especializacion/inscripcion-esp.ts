export interface InscripcionEsp {
    nombreUsuario?:      string;
    correoUsuario?:      string;
    cedula?:             string;
    nombre?:             string;
    apellido?:           string;
    codDatoPersonal:     number;
    codPeriodoAcademico: number;
    codInscripcion:      number;
    codUsuario:          number | null;
    estado:              string;
    nombreCatalogoCurso: string;
  }
  