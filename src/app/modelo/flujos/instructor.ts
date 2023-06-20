export interface Instructor {
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

export const defaultInstructor: Instructor = {
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
