import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EspInscripcionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDatosPostulante(cedula: string) {
    // return this.http.get(`${ this.host }/postulante/${ cedula }`);
    const mockData = {
      nombre: 'John',
      apellido: 'Doe',
    };
    // Return a mock observable with the mock data
    return of(mockData);
  }


}
