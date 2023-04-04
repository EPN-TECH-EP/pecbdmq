import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnidadGestionComponent } from '../componentes/unidad-gestion/unidad-gestion.component';
import { CambiosPendientesGuard } from '../guard/cambios-pendientes.guard';


const routes: Routes = [
  {
    path: '',
    component: UnidadGestionComponent,
    canDeactivate: [CambiosPendientesGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadGestionRoutingModule { }