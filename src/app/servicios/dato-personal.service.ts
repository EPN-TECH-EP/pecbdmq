import { Injectable } from '@angular/core';
import {UpdateDatoPersonalDto} from "../modelo/dto/dato-personal.dto";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DatoPersonalService {

  private host = environment.apiUrl

  constructor(
    private http: HttpClient,

  ) { }

  update(datoPersonal: UpdateDatoPersonalDto, id: number) {
    return this.http.put(`${this.host}/datopersonal/${id}`, datoPersonal)
  }
}
