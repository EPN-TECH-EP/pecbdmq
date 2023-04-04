import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadGestionComponent } from '../componentes/unidad-gestion/unidad-gestion.component';
import { UnidadGestionRoutingModule } from './unidad-gestion-routing.module';
import { FormsModule } from '@angular/forms';

import { MdbTableModule } from 'mdb-angular-ui-kit/table';
import { HttpClientModule } from '@angular/common/http';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CambiosPendientesGuard } from '../guard/cambios-pendientes.guard';

@NgModule({
  imports: [
    UnidadGestionRoutingModule,    
    CommonModule,
    FormsModule,
    HttpClientModule,
    MdbTableModule,
    MdbFormsModule,
  ],
  declarations: [UnidadGestionComponent],
  providers: [CambiosPendientesGuard]
})
export class UnidadGestionModule { }