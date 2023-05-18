import {
  EstadoPeriodoAcademicoComponent
} from '../../componentes/estado-periodo-academico/estado-periodo-academico.component';
import {PonderacionComponent} from '../../componentes/ponderacion/ponderacion.component';
import {CatalogoEstadosComponent} from '../../componentes/catalogo-estados/catalogo-estados.component';
import {ModuloEstadosComponent} from '../../componentes/modulo-estados/modulo-estados.component';
import {SemestreComponent} from '../../componentes/semestre/semestre.component';
import {AulasComponent} from '../../componentes/aulas/aulas.component';
import {TipoPruebaComponent} from '../../componentes/tipo-prueba/tipo-prueba.component';
import {TipoProcedenciaComponent} from '../../componentes/tipo-procedencia/tipo-procedencia.component';
import {TipoFuncionarioComponent} from '../../componentes/tipo-funcionario/tipo-funcionario.component';
import {ModuloComponent} from '../../componentes/modulo/modulo.component';
//import {UnidadGestionComponent} from './../../componentes/unidad-gestion/unidad-gestion.component';
//import {UnidadGestion} from '../../modelo/unidad-gestion';
import {RouterModule, Routes} from '@angular/router';
import {MenuAdminComponent} from 'src/app/componentes/admin/administracion-plataforma/menu-admin/menu-admin.component';
import {MenuFormacionComponent} from 'src/app/componentes/flujos/formacion/menu-formacion/menu-formacion.component';
import {MateriaComponent} from 'src/app/componentes/materia/materia.component';
import {PrincipalComponent} from '../../componentes/principal/principal.component';
import {UsuariosComponent} from '../../componentes/admin/administracion-plataforma/usuarios/usuarios.component';
import {RolUsuarioComponent} from '../../componentes/admin/administracion-plataforma/rol-usuario/rol-usuario.component';
import {TipoDocumentoComponent} from 'src/app/componentes/tipo-documento/tipo-documento.component';
import {TipoNotaComponent} from 'src/app/componentes/tipo-nota/tipo-nota.component';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {
  MenuEspecializacionComponent
} from '../../componentes/flujos/especializacion/menu-especializacion/menu-especializacion.component';
import {
  MenuProfesionalizacionComponent
} from '../../componentes/flujos/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
import {BienvenidaComponent} from '../../componentes/bienvenida/bienvenida.component';
import {ValidacionComponent} from '../../componentes/flujos/formacion/validacion/validacion.component';

import {ParaleloComponent} from 'src/app/componentes/paralelo/paralelo.component';
import {TipoInstruccionComponent} from "../../componentes/tipo-instruccion/tipo-instruccion.component";
import {TipoBajaComponent} from "../../componentes/tipo-baja/tipo-baja.component";
import {TipoSancionComponent} from "../../componentes/tipo-sancion/tipo-sancion.component";
import {ComponenteNotaComponent} from '../../componentes/componente-nota/componente-nota.component';
import {CambiosPendientesGuard} from 'src/app/guard/cambios-pendientes.guard';
import {ConvocatoriaComponent} from 'src/app/componentes/flujos/formacion/convocatoria/convocatoria.component';
import {RequisitoComponent} from 'src/app/componentes/requisito/requisito.component';

//import { MenuItemComponent } from 'src/app/componentes/util/menu-item/menu-item.component';
import {CommonModule} from '@angular/common';
import {LocalDataService} from 'src/app/servicios/util/local-data.service';
import {RolComponent} from 'src/app/componentes/admin/administracion-plataforma/rol/rol.component';
import {MenuRolComponent} from 'src/app/componentes/admin/administracion-plataforma/menu-rol/menu-rol.component';
import {BotonVolverComponent} from "../../componentes/util/boton-volver/boton-volver.component";
import {ProcesoFormacionComponent} from "../../componentes/flujos/formacion/proceso-formacion/proceso-formacion.component";
import {
  ProcesoEspecializacionComponent
} from "../../componentes/flujos/especializacion/proceso-especializacion/proceso-especializacion.component";
import {
  ProcesoProfesionalizacionComponent
} from "../../componentes/flujos/profesionalizacion/proceso-profesionalizacion/proceso-profesionalizacion.component";
import {ListaInscripcionComponent} from "../../componentes/lista-inscripcion/lista-inscripcion.component";
import {NgModule} from "@angular/core";
import {PerfilComponent} from "../../componentes/user/perfil/perfil.component";
import { MenuComponent } from 'src/app/componentes/admin/administracion-plataforma/menu/menu.component';
import {
  GestionDocumentosComponent
} from "../../componentes/flujos/formacion/gestion-documentos/gestion-documentos.component";
import {EstadoProcesoFormacionComponent} from "../../componentes/flujos/formacion/estado-proceso/estado-proceso-formacion.component";


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
      {path: 'admin/menu', component: MenuComponent},
      // flujos y procesos
      {path: 'formacion/validacion', component: ValidacionComponent},
      {path: 'formacion/lista-inscripcion', component: ListaInscripcionComponent},
      {path: 'formacion/gestion-documentos', component: GestionDocumentosComponent},
      {path: 'formacion/estado', component: EstadoProcesoFormacionComponent},

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
      {path: 'requisito', component: RequisitoComponent},
      {path: 'perfil', component: PerfilComponent},

    ],
  },
];

@NgModule({
  declarations: [
    //MenuFormacionComponent,
    //MenuAdminComponent,
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
