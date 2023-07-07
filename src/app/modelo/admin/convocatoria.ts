import {Requisito} from "./requisito";
import {DocumentoFormacion} from "../flujos/formacion/documento";

export interface Convocatoria {
  codConvocatoria?        : number;
  codPeriodoEvaluacion    : number;
  codPeriodoAcademico     : number;
  nombre                  : string;
  estado                  : string;
  fechaInicioConvocatoria : Date;
  fechaFinConvocatoria    : Date;
  horaInicioConvocatoria  : string;
  horaFinConvocatoria     : string;
  codigoUnico             : number;
  cupoHombres             : number;
  cupoMujeres             : number;
  correo                  : string;
  documentos              : DocumentoFormacion[];
  requisitos              : Requisito[];
  fechaActual             : Date;
}
