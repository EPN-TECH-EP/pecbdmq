import {
  EstadoPeriodoAcademicoComponent
} from './../../componentes/estado-periodo-academico/estado-periodo-academico.component';
import {PonderacionComponent} from './../../componentes/ponderacion/ponderacion.component';
import {CatalogoEstadosComponent} from './../../componentes/catalogo-estados/catalogo-estados.component';
import {ModuloEstadosComponent} from './../../componentes/modulo-estados/modulo-estados.component';
import {SemestreComponent} from './../../componentes/semestre/semestre.component';
import {AulasComponent} from './../../componentes/aulas/aulas.component';
import {TipoPruebaComponent} from './../../componentes/tipo-prueba/tipo-prueba.component';
import {TipoProcedenciaComponent} from './../../componentes/tipo-procedencia/tipo-procedencia.component';
import {TipoFuncionarioComponent} from './../../componentes/tipo-funcionario/tipo-funcionario.component';
import {ModuloComponent} from './../../componentes/modulo/modulo.component';
//import {UnidadGestionComponent} from './../../componentes/unidad-gestion/unidad-gestion.component';
//import {UnidadGestion} from '../../modelo/unidad-gestion';
import {Component, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuAdminComponent} from 'src/app/componentes/admin/menu-admin/menu-admin.component';
import {MenuFormacionComponent} from 'src/app/componentes/formacion/menu-formacion/menu-formacion.component';
import {MateriaComponent} from 'src/app/componentes/materia/materia.component';
import {PrincipalComponent} from '../../componentes/principal/principal.component';
import {UsuariosComponent} from '../../componentes/admin/usuarios/usuarios.component';
import {RolUsuarioComponent} from '../../componentes/admin/rol-usuario/rol-usuario.component';
import {TipoDocumentoComponent} from 'src/app/componentes/tipo-documento/tipo-documento.component';
import {TipoNotaComponent} from 'src/app/componentes/tipo-nota/tipo-nota.component';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {
  MenuEspecializacionComponent
} from '../../componentes/especializacion/menu-especializacion/menu-especializacion.component';
import {
  MenuProfesionalizacionComponent
} from '../../componentes/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
import {BienvenidaComponent} from '../../componentes/bienvenida/bienvenida.component';
import {ValidacionComponent} from '../../componentes/formacion/validacion/validacion.component';

import {TipoFuncionario} from '../../modelo/tipo-funcionario';
import {ParaleloComponent} from 'src/app/componentes/paralelo/paralelo.component';
import {TipoInstruccionComponent} from "../../componentes/tipo-instruccion/tipo-instruccion.component";
import {TipoBajaComponent} from "../../componentes/tipo-baja/tipo-baja.component";
import {TipoSancionComponent} from "../../componentes/tipo-sancion/tipo-sancion.component";
import {ComponenteNotaComponent} from '../../componentes/componente-nota/componente-nota.component';
import {CambiosPendientesGuard} from 'src/app/guard/cambios-pendientes.guard';
import {ConvocatoriaComponent} from 'src/app/componentes/convocatoria/convocatoria.component';
import {RequisitoComponent} from 'src/app/componentes/requisito/requisito.component';
import {TablaComponent} from 'src/app/tabla/tabla.component';

//import { MenuItemComponent } from 'src/app/componentes/util/menu-item/menu-item.component';
import {CommonModule} from '@angular/common';
import {LocalDataService} from 'src/app/servicios/util/local-data.service';
import {RolComponent} from 'src/app/componentes/admin/rol/rol.component';
import {MenuRolComponent} from 'src/app/componentes/admin/menu-rol/menu-rol.component';
import {BotonVolverComponent} from "../../componentes/util/boton-volver/boton-volver.component";
import {ProcesoFormacionComponent} from "../../componentes/formacion/proceso-formacion/proceso-formacion.component";
import {
  ProcesoEspecializacionComponent
} from "../../componentes/especializacion/proceso-especializacion/proceso-especializacion.component";
import {
  ProcesoProfesionalizacionComponent
} from "../../componentes/profesionalizacion/proceso-profesionalizacion/proceso-profesionalizacion.component";
import {ListaInscripcionComponent} from "../../componentes/lista-inscripcion/lista-inscripcion.component";


const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent,
    children: [
      //sub-menu
      {path: 'bienvenida', component: BienvenidaComponent},
      {path: 'admin', component: MenuAdminComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      {path: 'menuFormacion', component: MenuFormacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/},
      {
        path: 'menuEspecializacion',
        component: MenuEspecializacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/
      },
      {
        path: 'menuProfesionalizacion',
        component: MenuProfesionalizacionComponent/*, pathMatch: 'full' , outlet: 'principal-outlet'*/
      },
      // componentes funcionales
      {path: 'materia', component: MateriaComponent},
      {
        path: 'unidadGestion',
        //component: UnidadGestionComponent,
        loadChildren: () => import('./../../modulos/unidad-gestion.module').then(m => m.UnidadGestionModule),
        //canDeactivate: [CambiosPendientesGuard],
      },
      {path: 'tipoPrueba', component: TipoPruebaComponent},
      {path: 'aula', component: AulasComponent},
      {path: 'semestre', component: SemestreComponent},
      {path: 'modulo', component: ModuloComponent},
      {path: 'tipoFuncionario', component: TipoFuncionarioComponent},
      {path: 'tipoDocumento', component: TipoDocumentoComponent},
      {path: 'tipoProcedencia', component: TipoProcedenciaComponent},
      {path: 'tipoNota', component: TipoNotaComponent},
      {path: 'tipoBaja', component: TipoBajaComponent},
      {path: 'tipoSancion', component: TipoSancionComponent},
      {path: 'componenteNota', component: ComponenteNotaComponent},
      //{ path: '', component: MenuFormacionComponent/*, pathMatch: 'full'*/}
      {path: 'admin/usuarios', component: UsuariosComponent},
      {path: 'admin/roles-usuarios', component: RolUsuarioComponent},
      {path: 'admin/rol', component: RolComponent},
      {path: 'admin/menuRol', component: MenuRolComponent},
      // flujos y procesos
      {path: 'formacion/validacion', component: ValidacionComponent},
      {path: 'formacion/lista-inscripcion', component: ListaInscripcionComponent},
      {path: 'paralelo', component: ParaleloComponent},
      {path: 'tipoInstruccion', component: TipoInstruccionComponent},
      {path: 'ponderacion', component: PonderacionComponent},
      {path: 'moduloEstados', component: ModuloEstadosComponent},
      {path: 'catalogo', component: CatalogoEstadosComponent},
      {path: 'estadoPeriodoAcademico', component: EstadoPeriodoAcademicoComponent},
      {path: 'formacion/proceso', component: ProcesoFormacionComponent},
      {path: 'convocatoria', component: ConvocatoriaComponent},
      {path: 'especializacion/proceso', component: ProcesoEspecializacionComponent},
      {path: 'profesionalizacion/proceso', component: ProcesoProfesionalizacionComponent},

    ],
  },
];

@NgModule({
  declarations: [
    //MenuFormacionComponent,
    MenuAdminComponent,
    //MenuItemComponent,
    BotonVolverComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  exports: [RouterModule, BotonVolverComponent],
  providers: [
    MdbPopconfirmService,
    CambiosPendientesGuard,
    LocalDataService,
  ]
})
export class PrincipalModuleModule {
}
