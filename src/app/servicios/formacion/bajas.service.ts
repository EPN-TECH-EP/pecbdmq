import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})


export class BajasService {

  private host = environment.apiUrl

  constructor(private http: HttpClient) {
  }


}
