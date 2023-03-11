
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { AutenticacionGuard } from './guard/autenticacion.guard';
import { RegistroComponent } from './componentes/registro/registro.component';
import { Usuario } from './modelo/usuario';
import { TipoNota} from "./modelo/tipo_nota";

const routes: Routes = [
  {path: 'principal', component: PrincipalComponent, canActivate: [AutenticacionGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: RegistroComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},

];
@NgModule({
  imports: [RouterModule.forRoot(routes,
    // TODO eliminar
    //{ enableTracing: true } // <-- debugging purposes only
    )],
  exports: [RouterModule],
  providers: [Usuario]
})
export class AppRoutingModule { }
