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
  codDatosPersonales     : number;
  codTipoProcedencia     : number;
  codEstacion            : number;
  codUnidadGestion       : number;
  codTipoContrato        : number;
  codCursoEspecializacion: number;
  codTipoInstructor      : number;
  descripcion            : string;
}
