import {Injectable} from '@angular/core';

@Injectable()
export class ProInscripcion {
  public codInscripcion?: number;
  public codEstudiante?: number;
  public codConvocatoria?: number;
  public adjunto?: string;
  public aceptado?: boolean;
}
