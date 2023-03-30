import { ModuloEstadosService } from './../../servicios/modulo-estados.service';
import { CatalogoEstados } from './../../modelo/catalogo-estados';
import { CatalogoEstadosService } from './../../servicios/catalogo-estados.service';
import { Modulo } from 'src/app/modelo/modulo';
import { ModuloEstados } from './../../modelo/modulo-estados';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MdbNotificationRef, MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../util/alerta/alerta.component';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TipoAlerta } from 'src/app/enum/tipo-alerta';
import { CustomHttpResponse } from 'src/app/modelo/custom-http-response';
import { Notificacion } from 'src/app/util/notificacion';

@Component({
  selector: 'app-modulo-estados',
  templateUrl: './modulo-estados.component.html',
  styleUrls: ['./modulo-estados.component.scss']
})
export class ModuloEstadosComponent implements OnInit {

  modulosEstados: ModuloEstados[];
  moduloEstados: ModuloEstados;
  moduloEstadosEditForm: ModuloEstados;
  modulos: Modulo[];
  estadosCatalogo: CatalogoEstados[];

  selectedestadoCatalogo: any = null; // variable para almacenar el registro seleccionado


  private subscriptions: Subscription[] = [];
  notificationRef: MdbNotificationRef<AlertaComponent> | null = null;
  public showLoading: boolean;

  @ViewChild('table') table!: MdbTableDirective<ModuloEstados>;

  editElementIndex = -1;
  addRow = false;


  headers = [
    'Modulo',
    'Catálogo Estados',
    'Orden'
  ];



  constructor(
    private notificationService: MdbNotificationService,
    private Api: ModuloEstados,
    private ApiModulo: ModuloService,
    private ApiModuloEstados:ModuloEstadosService,
    private ApiCatalogoEstados: CatalogoEstados,
    private ApiCatalogo: CatalogoEstadosService,
    public  Modulodover: ModuloEstados,
    ){
      this.modulosEstados =[];
      this.subscriptions=[];
      this.moduloEstados ={
        codigo: 0,
        estadoCatalogo:0,
        orden:0,
        modulo:0,
        estado:'ACTIVO'
      }
      this.moduloEstadosEditForm ={
        codigo: 0,
        estadoCatalogo:0,
        orden:0,
        modulo:0,
        estado:'ACTIVO'
      }
    }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  ngOnInit(): void {

    this.ApiModuloEstados.getModuloEstados().subscribe(data => {
      this.modulosEstados = data;

    });

    this.ApiCatalogo.getCatalogo().subscribe(data => {
      this.estadosCatalogo = data;
    });

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


 public registro(moduloEstados: ModuloEstados): void {
  moduloEstados={...moduloEstados,
    estadoCatalogo:0,
    orden:0,
    modulo:0,
    estado:'ACTIVO'};
   this.showLoading = true;
     this.subscriptions.push(
      this.ApiModuloEstados.registroModuloEstados(moduloEstados).subscribe({
        next: (response: HttpResponse<ModuloEstados>) => {
          let nuevoModulo: ModuloEstados = response.body;
         this.table.data.push(nuevoModulo);
         this.notificacionOK('...');
         this.ApiModuloEstados.getModuloEstados().subscribe(data => {
          this.modulosEstados = data;
        });

       this.ApiModulo.getModulo().subscribe(data => {
          this.modulos = data;
        });

         this.moduloEstados ={
          codigo: 0,
          estadoCatalogo:0,
          orden:0,
          modulo:0,
          estado:'ACTIVO'
        }

        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificacion(errorResponse);
           this.showLoading = false;
       },
     })
   );
 }


 editRow(index: number) {
  this.editElementIndex = index;
  this.moduloEstadosEditForm = {...this.modulosEstados[index]};
  this.moduloEstadosEditForm = {
    codigo: 0,
        estadoCatalogo:0,
        orden:0,
        modulo:0,
        estado:'ACTIVO'
};
}

undoRow() {
  this.moduloEstadosEditForm = {
    codigo: 0,
        estadoCatalogo:0,
        orden:0,
        modulo:0,
        estado:'ACTIVO'
  };
  this.editElementIndex = -1;
}

   public actualizar(moduloEstados: ModuloEstados, formValue): void {
    moduloEstados={...moduloEstados,
      modulo: formValue.modulo,
      estadoCatalogo: formValue.catalogo,
      orden: formValue.orden,
      estado: 'ACTIVO'
};
    this.showLoading = true;
    this.subscriptions.push(
      this.ApiModuloEstados.actualizarModuloEstados(moduloEstados,moduloEstados.codigo).subscribe({
      next: (response) => {
        this.notificacionOK('....');
        this.modulosEstados[this.editElementIndex] = response.body;
        this.showLoading = false;
        this.ApiModuloEstados.getModuloEstados().subscribe(data => {
          this.modulosEstados = data;
        });

        this.ApiModulo.getModulo().subscribe(data => {
          this.modulos = data;
        });

        this.ApiCatalogo.getCatalogo().subscribe(data => {
          this.estadosCatalogo = data;
        });
        this.moduloEstados ={
          codigo: 0,
          estadoCatalogo:0,
          orden:0,
          modulo:0,
          estado:'ACTIVO'
        }
        this.editElementIndex = -1;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.notificacion(errorResponse);
      },
  })
)
}

//eliminar
    public eliminar(codigo: number): void {
      this.showLoading = true;
      this.subscriptions.push(
        this.ApiModuloEstados.eliminarModuloEstados(codigo).subscribe({
          next: (response: string) => {
            this.notificacionOK('El módulo de estado de eliminó correctamente');
            this.showLoading = false;
            const index = this.modulosEstados.findIndex(moduloEstados => moduloEstados.codigo === codigo);
            this.modulosEstados.splice(index, 1);
            this.modulosEstados = [...this.modulosEstados]
            this.showLoading = false;
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.notificacion(errorResponse);
          },
        })
      );
    }

     public mostrarModulo(): void {
       this.ApiModulo.getModulo().subscribe(data => {
         this.modulos = data;
       })
   }


    showRecord(): void {
      this.ApiCatalogo.getCatalogo().subscribe(data => {
        this.selectedestadoCatalogo = data;
      });
    }

}
