import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { AutenticacionGuard } from './guard/autenticacion.guard';
import { RegistroComponent } from './componentes/registro/registro.component';
import { Usuario } from './modelo/usuario';
import { CargaArchivoComponent } from './componentes/util/carga-archivo/carga-archivo.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'cargaArchivo', component: CargaArchivoComponent },
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivate: [AutenticacionGuard],
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
