export class ProCumpleRequisitosDto {
  codCumpleRequisito: number;
  codInscripcion: number;
  codRequisito: number;
  nombreRequisito: string;
  cumple: boolean;
  observaciones: string;
  observacionMuestra: string
}

export class ProCumpleRequisitosCreateUpdateDto {
  codCumpleRequisito: number;
  codInscripcion: number;
  codRequisito: number;
  cumple: boolean;
  observaciones: string;
  observacionMuestra: string
}

export const defaultCumpleRequisitos: ProCumpleRequisitosDto = {
  codCumpleRequisito: 0,
  codInscripcion: 0,
  codRequisito: 0,
  nombreRequisito: '',
  cumple: false,
  observaciones: '',
  observacionMuestra: ''
}
