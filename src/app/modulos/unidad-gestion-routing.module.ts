import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnidadGestionComponent } from '../componentes/unidad-gestion/unidad-gestion.component';


const routes: Routes = [
  {
    path: '',
    component: UnidadGestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadGestionRoutingModule { }