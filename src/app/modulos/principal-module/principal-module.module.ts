import { SemestreComponent } from './../../componentes/semestre/semestre.component';
import { PeriodoAcademicoComponent } from './../../componentes/periodo-academico/periodo-academico.component';
import { AulasComponent } from './../../componentes/aulas/aulas.component';
import { TipoPruebaComponent } from './../../componentes/tipo-prueba/tipo-prueba.component';
import { TipoProcedenciaComponent } from './../../componentes/tipo-procedencia/tipo-procedencia.component';
import { TipoFuncionarioComponent } from './../../componentes/tipo-funcionario/tipo-funcionario.component';
import { ModuloComponent } from './../../componentes/modulo/modulo.component';
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
import { TipoDocumentoComponent } from 'src/app/componentes/tipo-documento/tipo-documento.component';
import { TipoNotaComponent } from 'src/app/componentes/tipo-nota/tipo-nota.component';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { MenuEspecializacionComponent } from '../../componentes/especializacion/menu-especializacion/menu-especializacion.component';
import { MenuProfesionalizacionComponent } from '../../componentes/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
import { BienvenidaComponent } from '../../componentes/bienvenida/bienvenida.component';
import { ValidacionComponent } from '../../componentes/formacion/validacion/validacion.component';
import { UnidadGestion } from '../../modelo/unidad-gestion';
import { TipoFuncionario } from '../../modelo/tipo-funcionario';
import { Aula } from '../../modelo/Aula';
import { TipoBajaComponent } from "../../componentes/tipo-baja/tipo-baja.component";
import { TipoSancionComponent} from "../../componentes/tipo-sancion/tipo-sancion.component";

const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent,
    children: [
      //sub-menu
      { path: 'bienvenida', component:  BienvenidaComponent},
      { path: 'admin', component: MenuAdminComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'menuFormacion', component: MenuFormacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'menuEspecializacion', component: MenuEspecializacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'menuProfesionalizacion', component: MenuProfesionalizacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      // componentes funcionales
      { path: 'materia', component:  MateriaComponent},
      { path: 'unidadGestion', component: UnidadGestionComponent },
      { path: 'tipoPrueba', component: TipoPruebaComponent },
      { path: 'aula', component: AulasComponent },
      { path: 'periodoAcademico', component: PeriodoAcademicoComponent},
      { path: 'semestre', component: SemestreComponent},
      { path: 'modulo', component:ModuloComponent},
      { path: 'tipoFuncionario', component:TipoFuncionarioComponent},
      { path: 'tipoDocumento', component:TipoDocumentoComponent},
      { path: 'tipoProcedencia', component:TipoProcedenciaComponent},
      { path: 'tipoNota', component:TipoNotaComponent},
      { path: 'tipoBaja', component: TipoBajaComponent},
      { path: 'tipoSancion', component: TipoSancionComponent},
      //{ path: '', component: MenuFormacionComponent/*, pathMatch: 'full'*/}
      { path: 'admin/usuarios', component:  UsuariosComponent},
      { path: 'admin/roles-usuarios', component:  RolesUsuariosComponent},
      // flujos y procesos
      { path: 'formacion/validacion', component:  ValidacionComponent},
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
  exports: [RouterModule],
  providers: [
    MdbPopconfirmService
  ]
})
export class PrincipalModuleModule {}
