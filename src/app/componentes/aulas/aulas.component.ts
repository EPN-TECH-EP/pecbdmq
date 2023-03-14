import { Aula } from '../../modelo/aula';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MdbNotificationRef, MdbNotificationService} from 'mdb-angular-ui-kit/notification';
import { Subscription } from 'rxjs';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';
import { Notificacion } from '../../util/notificacion';
import { ViewChild } from '@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { MdbPopconfirmRef,MdbPopconfirmService,} from 'mdb-angular-ui-kit/popconfirm';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { AulaService } from 'src/app/servicios/aula.service';


@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.scss']
})
export class AulasComponent implements OnInit {
  aulas: Aula[];

  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;

  public showLoading: boolean;
  options = [
    { value: 'ACTIVO', label: 'ACTIVO' },
    { value: 'INACTIVO', label: 'INACTIVO' },
  ];

  @ViewChild('table') table!: MdbTableDirective<Aula>;

  editElementIndex = -1;
  addRow = false;

  headers = [
    'Nombre',
    'Capacidad',
    'Tipo',
    'Pcs',
    'Impresoras',
    'Internet',
    'Proyectores',
    'Instructor',
    'Sala Ocupada',

  ];

  constructor(
    private notificationService: MdbNotificationService,
    private Api: AulaService,
    public Valaula: Aula

    ){}

  // limpiar() {
  //   this.Codigo = '';
  //   this.Nombre = '';
  //   this.Capacidad = '';
  //   this.Tipo = '';
  //   this.Pcs = '';
  //   this.Impresoras = '';
  //   this.Internet = '';
  //   this.Proyectores = '';
  //   this.Instructor = '';
  //   this.SalaOcupada = '';
  //   this.Estado = '';
  // }


  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
  // onDeleteClick(data: Aula) {
  //   const index = this.aulas.indexOf(data);
  //   this.aulas.splice(index, 1);
  //   this.aulas = [...this.aulas]
  // }

  ngOnInit(): void {
    this.Valaula.estado='ACTIVO';
    this.Api.getAula().subscribe(data => {
      this.aulas = data;
    });
  }

  addNewRow(): void{
    const newRow: Aula = {
      codigo: this.Valaula.codigo,
      nombre: this.Valaula.nombre,
      capacidad: this.Valaula.capacidad,
      tipo: this.Valaula.tipo,
      pcs: this.Valaula.pcs,
      impresoras: this.Valaula.impresoras,
      internet: this.Valaula.internet,
      proyectores: this.Valaula.proyectores,
      instructor: this.Valaula.instructor,
      salaOcupada: this.Valaula.salaOcupada,
      estado: this.Valaula.estado,
    };
    this.aulas = [...this.aulas, { ...newRow }];
    this.Valaula.codigo='';
    this.Valaula.nombre= '';
    this.Valaula.capacidad=''as any;
    this.Valaula.tipo='' as any;
    this.Valaula.pcs='';
    this.Valaula.impresoras='';
    this.Valaula.internet='';
    this.Valaula.proyectores='' as any;
    this.Valaula.instructor='' as any;
    this.Valaula.salaOcupada='';
    this.Valaula.estado='';
  }

  editar(index: number){
    this.editElementIndex = index;
    this.Valaula={...this.aulas[index]};

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private notificacion(errorResponse: HttpErrorResponse) {
    let customError: CustomHttpResponse = errorResponse.error;
    let tipoAlerta: TipoAlerta = TipoAlerta.ALERTA_WARNING;

    let mensajeError = customError.mensaje;
    let codigoError = errorResponse.status;

    if (!mensajeError) {
      mensajeError = 'Error inesperado';
      tipoAlerta = TipoAlerta.ALERTA_ERROR;
    }

    if (codigoError === 0) {
     mensajeError = 'Error de conexión al servidor';
     tipoAlerta = TipoAlerta.ALERTA_ERROR;
   }
    this.notificationRef = Notificacion.notificar(
      this.notificationService,
      mensajeError,
      tipoAlerta
    )
  }

  public notificacionOK(mensaje:string){
    this.notificationRef = Notificacion.notificar(
    this.notificationService,
    mensaje,
    TipoAlerta.ALERTA_OK
    );
  }

  public registro(aula: Aula): void {
    aula={...aula, estado:'ACTIVO'};
    this.showLoading = true;
      this.Api.registroAula(aula).subscribe({
        next: (response: HttpResponse<Aula>) => {
          let nuevaAula: Aula = response.body;
          this.table.data.push(nuevaAula);
          this.notificacionOK('Aula creada con éxito');
          this.Valaula.codigo='';
          this.Valaula.nombre= '';
          this.Valaula.capacidad=''as any;
          this.Valaula.tipo='' as any;
          this.Valaula.pcs='';
          this.Valaula.impresoras='';
          this.Valaula.internet='';
          this.Valaula.proyectores='' as any;
          this.Valaula.instructor='' as any;
          this.Valaula.salaOcupada='';
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
        },
      })
  }


  public actualizar(aula: Aula, Codigo:any): void {
    aula={...aula, estado:'ACTIVO'};
   this.showLoading = true;
   this.subscriptions.push(
     this.Api.actualizarAula(aula,Codigo).subscribe({
     next: (response: HttpResponse<Aula>) => {
       let actualizaUnidad: Aula = response.body;
        this.notificacionOK('Aula actualizada con éxito');
        this.editElementIndex=-1;
        this.Valaula.codigo='';
        this.Valaula.nombre= '';
        this.Valaula.capacidad=''as any;
        this.Valaula.tipo='' as any;
        this.Valaula.pcs='';
        this.Valaula.impresoras='';
        this.Valaula.internet='';
        this.Valaula.proyectores='' as any;
        this.Valaula.instructor='' as any;
        this.Valaula.salaOcupada='';

     error: (errorResponse: HttpErrorResponse) => {
       this.notificacion(errorResponse);
        // this.showLoading = false;
     };
    },
  })
);
}



  public eliminar(Codigo: any, data: Aula): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.Api.eliminarAula(Codigo).subscribe({
        next: (response: string) => {
          this.notificacionOK('Semestre eliminada con éxito');
          const index = this.aulas.indexOf(data);
          this.aulas.splice(index, 1);
          this.aulas = [...this.aulas]
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
          console.log(errorResponse);
          this.showLoading = false;
        },
      })
    );
  }


}


