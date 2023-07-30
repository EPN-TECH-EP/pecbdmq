import { EstadoPeriodoAcademicoComponent } from '../../componentes/estado-periodo-academico/estado-periodo-academico.component';
import { PonderacionComponent } from '../../componentes/ponderacion/ponderacion.component';
import { CatalogoEstadosComponent } from '../../componentes/catalogo-estados/catalogo-estados.component';
import { ModuloEstadosComponent } from '../../componentes/modulo-estados/modulo-estados.component';
import { SemestreComponent } from '../../componentes/semestre/semestre.component';
import { AulasComponent } from '../../componentes/aulas/aulas.component';
import { TipoPruebaComponent } from '../../componentes/tipo-prueba/tipo-prueba.component';
import { TipoProcedenciaComponent } from '../../componentes/tipo-procedencia/tipo-procedencia.component';
import { TipoFuncionarioComponent } from '../../componentes/tipo-funcionario/tipo-funcionario.component';
import { ModuloComponent } from '../../componentes/modulo/modulo.component';
//import {UnidadGestionComponent} from './../../componentes/unidad-gestion/unidad-gestion.component';
//import {UnidadGestion} from '../../modelo/unidad-gestion';
import { RouterModule, Routes } from '@angular/router';
import { MenuAdminComponent } from 'src/app/componentes/admin/administracion-plataforma/menu-admin/menu-admin.component';
import { MenuFormacionComponent } from 'src/app/componentes/flujos/formacion/menus/menu-administracion-formacion/menu-formacion.component';
import { MateriaComponent } from 'src/app/componentes/materia/materia.component';
import { PrincipalComponent } from '../../componentes/principal/principal.component';
import { UsuariosComponent } from '../../componentes/admin/administracion-plataforma/usuarios/usuarios.component';
import { RolUsuarioComponent } from '../../componentes/admin/administracion-plataforma/rol-usuario/rol-usuario.component';
import { TipoDocumentoComponent } from 'src/app/componentes/tipo-documento/tipo-documento.component';
import { TipoNotaComponent } from 'src/app/componentes/tipo-nota/tipo-nota.component';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { MenuEspecializacionComponent } from '../../componentes/flujos/especializacion/menu-especializacion/menu-especializacion.component';
import { MenuProfesionalizacionComponent } from '../../componentes/flujos/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
import { BienvenidaComponent } from '../../componentes/bienvenida/bienvenida.component';
import { ValidacionComponent } from '../../componentes/flujos/formacion/validacion/validacion.component';

import { ParaleloComponent } from 'src/app/componentes/paralelo/paralelo.component';
import { TipoInstruccionComponent } from '../../componentes/tipo-instruccion/tipo-instruccion.component';
import { TipoBajaComponent } from '../../componentes/tipo-baja/tipo-baja.component';
import { TipoFaltaComponent } from '../../componentes/tipo-falta/tipo-falta.component';
import { ComponenteNotaComponent } from '../../componentes/componente-nota/componente-nota.component';
import { CambiosPendientesGuard } from 'src/app/guard/cambios-pendientes.guard';
import { ConvocatoriaComponent } from 'src/app/componentes/flujos/formacion/convocatoria/convocatoria.component';
import { RequisitoComponent } from 'src/app/componentes/requisito/requisito.component';

//import { MenuItemComponent } from 'src/app/componentes/util/menu-item/menu-item.component';
import { CommonModule } from '@angular/common';
import { LocalDataService } from 'src/app/servicios/util/local-data.service';
import { RolComponent } from 'src/app/componentes/admin/administracion-plataforma/rol/rol.component';
import { MenuRolComponent } from 'src/app/componentes/admin/administracion-plataforma/menu-rol/menu-rol.component';
import { BotonVolverComponent } from '../../componentes/util/boton-volver/boton-volver.component';
import { ProcesoFormacionComponent } from '../../componentes/flujos/formacion/menus/menu-proceso-formacion/proceso-formacion.component';
import { ProcesoEspecializacionComponent } from '../../componentes/flujos/especializacion/proceso-especializacion/proceso-especializacion.component';
import { ProcesoProfesionalizacionComponent } from '../../componentes/flujos/profesionalizacion/proceso-profesionalizacion/proceso-profesionalizacion.component';
import { NgModule } from '@angular/core';
import { PerfilComponent } from '../../componentes/user/perfil/perfil.component';
import { MenuComponent } from 'src/app/componentes/admin/administracion-plataforma/menu/menu.component';
import { GestionDocumentosComponent } from '../../componentes/flujos/formacion/gestion-documentos/gestion-documentos.component';
import { EstadoProcesoFormacionComponent } from '../../componentes/flujos/formacion/estado-proceso/estado-proceso-formacion.component';
import { AutenticacionChildGuard } from 'src/app/guard/autenticacion-child.guard';
import { InscripcionesComponent } from 'src/app/componentes/flujos/formacion/inscripciones/inscripciones.component';
import { GestionDelegadosComponent } from '../../componentes/flujos/formacion/gestion-delegados/gestion-delegados.component';
import { ReasignacionInscripcionComponent } from '../../componentes/flujos/formacion/reasignacion-inscripcion/reasignacion-inscripcion.component';
import { MenuFormacionAcademiaComponent } from '../../componentes/flujos/formacion/formacion-academica/menu-formacion-academia/menu-formacion-academia.component';
import { FaGestionDocumentosComponent } from '../../componentes/flujos/formacion/formacion-academica/fa-gestion-documentos/fa-gestion-documentos.component';
import { InstructoresComponent } from '../../componentes/flujos/formacion/formacion-academica/instructores/instructores.component';
import { MateriasComponent } from '../../componentes/flujos/formacion/formacion-academica/materias/materias.component';
import { SubtipoPruebaComponent } from 'src/app/componentes/flujos/formacion/subtipo-prueba/subtipo-prueba.component';
import { ListaPruebasComponent } from 'src/app/componentes/flujos/formacion/lista-pruebas/lista-pruebas.component';
import { RegistroNotasComponent } from '../../componentes/flujos/formacion/formacion-academica/registro-notas/registro-notas.component';

import { MuestraComponent } from '../../componentes/flujos/formacion/muestra/muestra.component';
import { EstudiantesComponent } from '../../componentes/flujos/formacion/formacion-academica/estudiantes/estudiantes.component';
import { RegistroNotasDisciplinariasComponent } from '../../componentes/flujos/formacion/formacion-academica/registro-notas-disciplinarias/registro-notas-disciplinarias.component';
import { NotasEstudiantesComponent } from '../../componentes/flujos/formacion/formacion-academica/notas-estudiantes/notas-estudiantes.component';
import { MenuConvocatoriaComponent } from '../../componentes/flujos/formacion/menus/menu-convocatoria/menu-convocatoria.component';
import { MenuValidacionRequisitosComponent } from '../../componentes/flujos/formacion/menus/menu-validacion-requisitos/menu-validacion-requisitos.component';
import { MenuPruebasComponent } from '../../componentes/flujos/formacion/menus/menu-pruebas/menu-pruebas.component';
import { MenuGraduacionComponent } from '../../componentes/flujos/formacion/menus/menu-graduacion/menu-graduacion.component';

import { SubtipoParametrosComponent } from 'src/app/componentes/flujos/formacion/subtipo-parametros/subtipo-parametros.component';
import { ResultadosPruebasComponent } from 'src/app/componentes/flujos/formacion/resultados-pruebas/resultados-pruebas.component';
import { FichaPersonalComponent } from "../../componentes/user/ficha-personal/ficha-personal.component";
import { HistoricoModuloComponent } from "../../componentes/user/historico-modulo/historico-modulo.component";
import {
  ComponenteNotaFormacion
} from "../../componentes/flujos/formacion/formacion-academica/componente-nota-formacion/componente-nota-formacion.component";
import { CatalogoCursoComponent } from 'src/app/componentes/flujos/especializacion/catalogo-curso/catalogo-curso.component';

const routes: Routes = [
  {
    path: 'principal',
    component: PrincipalComponent,
    canActivateChild: [AutenticacionChildGuard],
    children: [
      //sub-menu
      { path: 'bienvenida', component: BienvenidaComponent },
      { path: 'admin', component: MenuAdminComponent /*, pathMatch: 'full' , outlet: 'principal-outlet'*/ },
      { path: 'menuFormacion', component: MenuFormacionComponent /*, pathMatch: 'full' , outlet: 'principal-outlet'*/ },
      {
        path: 'menuEspecializacion',
        component: MenuEspecializacionComponent /*, pathMatch: 'full' , outlet: 'principal-outlet'*/,
      },
      {
        path: 'menuProfesionalizacion',
        component: MenuProfesionalizacionComponent /*, pathMatch: 'full' , outlet: 'principal-outlet'*/,
      },
      // componentes funcionales
      { path: 'materia', component: MateriaComponent },
      {
        path: 'unidadGestion',
        //component: UnidadGestionComponent,
        loadChildren: () => import('./../../modulos/unidad-gestion.module').then((m) => m.UnidadGestionModule),
        //canDeactivate: [CambiosPendientesGuard],
      },
      { path: 'tipoPrueba', component: TipoPruebaComponent },
      { path: 'aula', component: AulasComponent },
      { path: 'semestre', component: SemestreComponent },
      { path: 'modulo', component: ModuloComponent },
      { path: 'tipoFuncionario', component: TipoFuncionarioComponent },
      { path: 'tipoDocumento', component: TipoDocumentoComponent },
      { path: 'tipoProcedencia', component: TipoProcedenciaComponent },
      { path: 'tipoNota', component: TipoNotaComponent },
      { path: 'tipoBaja', component: TipoBajaComponent },
      { path: 'tipoFalta', component: TipoFaltaComponent },
      { path: 'componenteNota', component: ComponenteNotaComponent },
      //{ path: '', component: MenuFormacionComponent/*, pathMatch: 'full'*/}
      { path: 'admin/usuarios', component: UsuariosComponent },
      { path: 'admin/roles-usuarios', component: RolUsuarioComponent },
      { path: 'admin/rol', component: RolComponent },
      { path: 'admin/menuRol', component: MenuRolComponent },
      { path: 'admin/menu', component: MenuComponent },
      // flujos y procesos
      { path: 'formacion/gestion-documentos', component: GestionDocumentosComponent },
      { path: 'formacion/estado', component: EstadoProcesoFormacionComponent },
      { path: 'formacion/inscripciones', component: InscripcionesComponent },
      { path: 'formacion/validacion', component: ValidacionComponent },
      { path: 'formacion/muestra', component: MuestraComponent },
      { path: 'formacion/gestion-delegados', component: GestionDelegadosComponent },
      { path: 'formacion/reasignacion-inscripciones', component: ReasignacionInscripcionComponent },
      { path: 'formacion/academia/menu', component: MenuFormacionAcademiaComponent },
      { path: 'formacion/academia/gestion-documentos', component: FaGestionDocumentosComponent },
      { path: 'formacion/academia/instructores', component: InstructoresComponent },
      { path: 'formacion/academia/materias', component: MateriasComponent },
      { path: 'formacion/academia/estudiantes', component: EstudiantesComponent },
      { path: 'formacion/academia/notas', component: RegistroNotasComponent },
      { path: 'formacion/academia/notas-disciplina', component: RegistroNotasDisciplinariasComponent },
      { path: 'formacion/academia/notas-estudiantes', component: NotasEstudiantesComponent },
      { path: 'formacion/academia/componente-nota', component: ComponenteNotaFormacion },

      { path: 'paralelo', component: ParaleloComponent },
      { path: 'tipoInstruccion', component: TipoInstruccionComponent },
      { path: 'ponderacion', component: PonderacionComponent },
      { path: 'moduloEstados', component: ModuloEstadosComponent },
      { path: 'catalogo', component: CatalogoEstadosComponent },
      { path: 'estadoPeriodoAcademico', component: EstadoPeriodoAcademicoComponent },
      { path: 'formacion/proceso', component: ProcesoFormacionComponent },
      { path: 'convocatoria', component: ConvocatoriaComponent },
      { path: 'especializacion/proceso', component: ProcesoEspecializacionComponent },
      { path: 'especializacion/catalogo-curso', component: CatalogoCursoComponent },
      { path: 'profesionalizacion/proceso', component: ProcesoProfesionalizacionComponent },
      { path: 'requisito', component: RequisitoComponent },
      { path: 'perfil', component: PerfilComponent },
      // formacion - pruebas
      { path: 'formacion/pruebas/subtipo-prueba', component: SubtipoPruebaComponent },
      { path: 'formacion/pruebas/subtipo-parametros', component: SubtipoParametrosComponent },
      { path: 'formacion/pruebas/lista-pruebas', component: ListaPruebasComponent },
      { path: 'formacion/pruebas/resultados-pruebas', component: ResultadosPruebasComponent },
      { path: 'formacion/menu-convocatoria', component: MenuConvocatoriaComponent },
      { path: 'formacion/menu-validacion', component: MenuValidacionRequisitosComponent },
      { path: 'formacion/menu-pruebas', component: MenuPruebasComponent },
      { path: 'formacion/menu-academia', component: MenuFormacionAcademiaComponent },
      { path: 'formacion/menu-graduacion', component: MenuGraduacionComponent },

      {path: 'fichaPersonal', component: FichaPersonalComponent},
      {path: 'historicoModulo', component: HistoricoModuloComponent},

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
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule, BotonVolverComponent],
  providers: [MdbPopconfirmService, CambiosPendientesGuard, LocalDataService],
})
export class PrincipalModuleModule {}
