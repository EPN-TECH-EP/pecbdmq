import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse, HttpErrorResponse, HttpEvent,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DocumentosHabilitantes } from '../modelo/documentos-habilitantes';
@Injectable({
  providedIn: 'root'
})
export class DocumentosHabilitantesService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getDocumentosHabilitantes(): Observable<DocumentosHabilitantes[]> {
    return this.http.get<DocumentosHabilitantes[]>(`${this.host}/documentohabilitante/listar`);
  }

  public crearDocumentosHabilitantes(documentoHabilitante: DocumentosHabilitantes): Observable<HttpResponse< DocumentosHabilitantes>> {
    return this.http.post<DocumentosHabilitantes>(`${this.host}/documentohabilitante/crear`, documentoHabilitante, { observe: 'response' });
  }
  public actualizarDocumentosHabilitantes(documentoHabilitante: DocumentosHabilitantes,  codDocumentoHabilitante :any): Observable<HttpResponse<DocumentosHabilitantes>> {
    return this.http.put<DocumentosHabilitantes>(`${this.host}/documentohabilitante/${codDocumentoHabilitante}`, documentoHabilitante, { observe: 'response' });
  }

  public eliminarDocumentosHabilitantes(codDocumentoHabilitante: any): Observable<string> {
    return this.http.delete<any>(`${this.host}/documentohabilitante/${codDocumentoHabilitante}`);
    }


  }
