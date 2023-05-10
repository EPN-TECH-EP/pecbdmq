import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Cargo} from "../modelo/admin/institucionales/cargo";

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getCargos() {
    return this.http.get<Cargo[]>(`${this.host}/cargo/listar`);
  }

}
