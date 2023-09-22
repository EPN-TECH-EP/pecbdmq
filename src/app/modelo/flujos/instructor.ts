export interface Instructor {
  codDatosPersonales : number;
  tipoInstructor    : string;
  codTipoInstructor : number;
  codInstructor     : number;
  codTipoProcedencia: number;
  tipoProcedencia   : string;
  codEstacion       : number;
  nombreZona        : string;
  codUnidadGestion  : number;
  unidadGestion     : string;
  codTipoContrato   : number;
  nombreTipoContrato: string;
  cedula            : string;
  nombre            : string;
  apellido          : string;
  correoPersonal    : string;
}

export interface InstructorRequest {
  codDatosPersonales: number;
  codTipoProcedencia: number;
  codEstacion       : number;
  codUnidadGestion  : number;
  codTipoContrato   : number;
  estado?           : string;
}

export const defaultInstructor: Instructor = {
  codDatosPersonales : 0,
  codInstructor     : 0,
  codTipoProcedencia: 0,
  tipoProcedencia   : '',
  codEstacion       : 0,
  nombreZona        : '',
  codUnidadGestion  : 0,
  unidadGestion     : '',
  codTipoContrato   : 0,
  nombreTipoContrato: '',
  cedula            : '',
  nombre            : '',
  apellido          : '',
  correoPersonal    : '',
  tipoInstructor    : '',
  codTipoInstructor : 0,
}

export interface EspInstructorRequest {
  codInstructorCurso     : number;
  codInstructor          : number;
  codDatosPersonales     : number;
  codTipoProcedencia     : number;
  codEstacion            : number;
  codUnidadGestion       : number;
  codTipoContrato        : number;
  codCursoEspecializacion: number;
  codTipoInstructor      : number;
  descripcion            : string;
}

export interface EspInstructorResponse {
  codInstructorCurso      : number;
  codInstructor           : number;
  cedula                  : string;
	nombre                  : string;
	apellido                : string;
  codCursoEspecializacion : number;
  nombreCatalogoCurso     : string;
	codTipoInstructor       : number;
	nombreTipoInstructor    : string;
  correoPersonal          : string;
  correoInstitucional     : string;
  codDatosPersonales     : number;
  codTipoProcedencia     : number;
  codEstacion            : number;
  codUnidadGestion       : number;
  codTipoContrato        : number;
  descripcion            : string;
  tipoProcedencia        : string;
  nombreZona             : string;
  unidadGestion          : string;
  nombreTipoContrato     : string;
}

export const defaultEspInstructor: EspInstructorResponse = {
  codInstructorCurso      : 0,
  codInstructor           : 0,
  codDatosPersonales      : 0,
  codTipoProcedencia      : 0,
  codEstacion             : 0,
  codUnidadGestion        : 0,
  codTipoContrato         : 0,
  codCursoEspecializacion : 0,
  codTipoInstructor       : 0,
  cedula                  : '',
	nombre                  : '',
	apellido                : '',
  nombreCatalogoCurso     : '',
	nombreTipoInstructor    : '',
  correoPersonal          : '',
  correoInstitucional     : '',
  descripcion             : '',
  tipoProcedencia         : '',
  nombreZona              : '',
  unidadGestion           : '',
  nombreTipoContrato      : '',
}
