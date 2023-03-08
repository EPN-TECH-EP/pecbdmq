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
import { TipoDocumentoComponent } from 'src/app/componentes/tipo-documento/tipo-documento.component';
import { TipoNotaComponent } from 'src/app/componentes/tipo-nota/tipo-nota.component';

const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent,
    children: [
      { path: 'formacion', component: MenuFormacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'admin', component: MenuAdminComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      { path: 'materia', component:  MateriaComponent},
      { path: 'unidadGestion', component: UnidadGestionComponent },
      { path: 'tipoPrueba', component: TipoPruebaComponent },
      { path: 'aula', component: AulasComponent },
      { path: 'periodoAcademico', component: PeriodoAcademicoComponent},
      { path: 'semestre', component: SemestreComponent}
      { path: 'modulo', component:ModuloComponent},
      { path: 'tipoFuncionario', component:TipoFuncionarioComponent},
      { path: 'tipoDocumento', component:TipoDocumentoComponent},
      { path: 'tipoProcedencia', component:TipoProcedenciaComponent},
      { path: 'tipoNota', component:TipoNotaComponent},

      //{ path: '', component: MenuFormacionComponent/*, pathMatch: 'full'*/}
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
