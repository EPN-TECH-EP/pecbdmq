import { InscripcionComponent } from './componentes/flujos/formacion/inscripcion/inscripcion.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { AutenticacionGuard } from './guard/autenticacion.guard';
import { RegistroComponent } from './componentes/registro/registro.component';
import { Usuario } from './modelo/admin/usuario';
import { CargaArchivoComponent } from './componentes/util/carga-archivo/carga-archivo.component';
import { AutenticacionChildGuard } from './guard/autenticacion-child.guard';
import {
  InscripcionEspecializacionComponent
} from "./componentes/flujos/especializacion/inscripcion/inscripcion-especializacion.component";
import { ProInscripcionComponent } from './componentes/flujos/profesionalizacion/pro-inscripcion/pro-inscripcion.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'cargaArchivo', component: CargaArchivoComponent },
  { path: 'inscripcion', component: InscripcionComponent },
  { path: 'especializacion/inscripcion/:codCurso', component: InscripcionEspecializacionComponent },
  { path: 'profesionalizacion/inscripcion', component: ProInscripcionComponent },



  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AutenticacionGuard], canActivateChild: [AutenticacionChildGuard],
    //loadChildren: () => import('./modulos/principal-module/principal-module.module').then(m => m.PrincipalModuleModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      // TODO eliminar
      //{ enableTracing: true } // <-- debugging purposes only
    ),
  ],
  exports: [RouterModule],
  providers: [Usuario],
})
export class AppRoutingModule {}
