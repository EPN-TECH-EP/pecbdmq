import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Ciudadano} from "../../modelo/flujos/formacion/api-bomberos/ciudadano";
import {DatosEducacionMedia} from "../../modelo/flujos/formacion/api-bomberos/datos-educacion-media";
import {DatosEducacionSuperior} from "../../modelo/flujos/formacion/api-bomberos/datos-educacion-superior";

@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getByCedula(cedula: string) {
    return this.http.get<Ciudadano[]>(`${this.host}/apicbdmq/cuidadanos/${cedula}`);
  }

  getEducacionMedia(cedula: string) {
    return this.http.get<DatosEducacionMedia[]>(`${this.host}/apicbdmq/educacionMedia/${cedula}`);
  }

  getEducacionSuperior(cedula: string) {
    return this.http.get<DatosEducacionSuperior[]>(`${this.host}/apicbdmq/educacionSuperior/${cedula}`);
  }


}
