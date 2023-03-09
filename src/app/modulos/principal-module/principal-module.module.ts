import { UnidadGestionComponent } from './../../componentes/unidad-gestion/unidad-gestion.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuAdminComponent } from 'src/app/componentes/admin/menu-admin/menu-admin.component';
import { MenuFormacionComponent } from 'src/app/componentes/formacion/menu-formacion/menu-formacion.component';
import { MateriaComponent } from 'src/app/componentes/materia/materia.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrincipalComponent } from '../../componentes/principal/principal.component';
import { UsuariosComponent } from '../../componentes/admin/usuarios/usuarios.component';
import { RolesUsuariosComponent } from '../../componentes/admin/roles-usuarios/roles-usuarios.component';

const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent,
    children: [
      { path: 'formacion', component: MenuFormacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'admin', component: MenuAdminComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'materia', component:  MateriaComponent},
      { path: 'unidadGestion', component: UnidadGestionComponent },
      //{ path: '', component: MenuFormacionComponent/*, pathMatch: 'full'*/}
      { path: 'admin/usuarios', component:  UsuariosComponent},
      { path: 'admin/roles-usuarios', component:  RolesUsuariosComponent},
    ],
  },
];

@NgModule({
  declarations: [
    MenuFormacionComponent,
    MenuAdminComponent,

  ],
  imports: [
    /*CommonModule,
    HttpClientModule,
    FormsModule,*/
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PrincipalModuleModule {}
