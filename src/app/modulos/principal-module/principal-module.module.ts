import {
  EstadoPeriodoAcademicoComponent
} from '../../componentes/estado-periodo-academico/estado-periodo-academico.component';
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
import {
  MenuAdminComponent
} from 'src/app/componentes/admin/administracion-plataforma/menu-admin/menu-admin.component';
import {
  MenuFormacionComponent
} from 'src/app/componentes/flujos/formacion/menus/menu-administracion-formacion/menu-formacion.component';
import { MateriaComponent } from 'src/app/componentes/materia/materia.component';
import { PrincipalComponent } from '../../componentes/principal/principal.component';
import { UsuariosComponent } from '../../componentes/admin/administracion-plataforma/usuarios/usuarios.component';
import {
  RolUsuarioComponent
} from '../../componentes/admin/administracion-plataforma/rol-usuario/rol-usuario.component';
import { TipoDocumentoComponent } from 'src/app/componentes/tipo-documento/tipo-documento.component';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';

import {
  MenuProfesionalizacionComponent
} from '../../componentes/flujos/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
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
import {
  ProcesoFormacionComponent
} from '../../componentes/flujos/formacion/menus/menu-proceso-formacion/proceso-formacion.component';
import {
  ProcesoEspecializacionComponent
} from '../../componentes/flujos/especializacion/proceso-especializacion/proceso-especializacion.component';
import {
  ProcesoProfesionalizacionComponent
} from '../../componentes/flujos/profesionalizacion/proceso-profesionalizacion/proceso-profesionalizacion.component';
import { NgModule } from '@angular/core';
import { PerfilComponent } from '../../componentes/user/perfil/perfil.component';
import { MenuComponent } from 'src/app/componentes/admin/administracion-plataforma/menu/menu.component';
import {
  GestionDocumentosComponent
} from '../../componentes/flujos/formacion/gestion-documentos/gestion-documentos.component';
import {
  EstadoProcesoFormacionComponent
} from '../../componentes/flujos/formacion/estado-proceso/estado-proceso-formacion.component';
import { AutenticacionChildGuard } from 'src/app/guard/autenticacion-child.guard';
import { InscripcionesComponent } from 'src/app/componentes/flujos/formacion/inscripciones/inscripciones.component';
import {
  GestionDelegadosComponent
} from '../../componentes/flujos/formacion/gestion-delegados/gestion-delegados.component';
import {
  ReasignacionInscripcionComponent
} from '../../componentes/flujos/formacion/reasignacion-inscripcion/reasignacion-inscripcion.component';
import {
  MenuFormacionAcademiaComponent
} from '../../componentes/flujos/formacion/formacion-academica/menu-formacion-academia/menu-formacion-academia.component';
import {
  FaGestionDocumentosComponent
} from '../../componentes/flujos/formacion/formacion-academica/fa-gestion-documentos/fa-gestion-documentos.component';
import {
  InstructoresComponent
} from '../../componentes/flujos/formacion/formacion-academica/instructores/instructores.component';
import { MateriasComponent } from '../../componentes/flujos/formacion/formacion-academica/materias/materias.component';
import { SubtipoPruebaComponent } from 'src/app/componentes/flujos/formacion/subtipo-prueba/subtipo-prueba.component';
import { ListaPruebasComponent } from 'src/app/componentes/flujos/formacion/lista-pruebas/lista-pruebas.component';
import {
  RegistroNotasComponent
} from '../../componentes/flujos/formacion/formacion-academica/registro-notas/registro-notas.component';

import { MuestraComponent } from '../../componentes/flujos/formacion/muestra/muestra.component';
import {
  EstudiantesComponent
} from '../../componentes/flujos/formacion/formacion-academica/estudiantes/estudiantes.component';
import {
  RegistroNotasDisciplinariasComponent
} from '../../componentes/flujos/formacion/formacion-academica/registro-notas-disciplinarias/registro-notas-disciplinarias.component';
import {
  NotasEstudiantesComponent
} from '../../componentes/flujos/formacion/formacion-academica/notas-estudiantes/notas-estudiantes.component';
import {
  MenuConvocatoriaComponent
} from '../../componentes/flujos/formacion/menus/menu-convocatoria/menu-convocatoria.component';
import {
  MenuValidacionRequisitosComponent
} from '../../componentes/flujos/formacion/menus/menu-validacion-requisitos/menu-validacion-requisitos.component';
import { MenuPruebasComponent } from '../../componentes/flujos/formacion/menus/menu-pruebas/menu-pruebas.component';
import {
  MenuGraduacionComponent
} from '../../componentes/flujos/formacion/menus/menu-graduacion/menu-graduacion.component';

import {
  SubtipoParametrosComponent
} from 'src/app/componentes/flujos/formacion/subtipo-parametros/subtipo-parametros.component';
import {
  ResultadosPruebasComponent
} from 'src/app/componentes/flujos/formacion/resultados-pruebas/resultados-pruebas.component';
import { FichaPersonalComponent } from "../../componentes/user/ficha-personal/ficha-personal.component";
import { HistoricoModuloComponent } from "../../componentes/user/historico-modulo/historico-modulo.component";
import {
  ComponenteNotaFormacion
} from "../../componentes/flujos/formacion/formacion-academica/componente-nota-formacion/componente-nota-formacion.component";
import {
  MenuConsultasComponent
} from "../../componentes/flujos/formacion/menus/menu-consultas/menu-consultas.component";
import {
  PeriodoAcademicoComponent
} from "../../componentes/flujos/formacion/periodo-academico/periodo-academico.component";
import {
  ApelacionesComponent
} from "../../componentes/flujos/formacion/formacion-academica/apelaciones/apelaciones.component";
import {
  CatalogoCursoComponent
} from 'src/app/componentes/flujos/especializacion/catalogo-curso/catalogo-curso.component';
import {
  MenuValidacionRequisitosEspecializacionComponent
} from 'src/app/componentes/flujos/especializacion/menus/menu-validacion-requisitos/menu-validacion-requisitos-especializacion.component';
import {
  ValidacionEspecializacionComponent
} from 'src/app/componentes/flujos/especializacion/validacion-especializacion/validacion-especializacion.component';
import {
  GestionDelegadosEspecializacionComponent
} from 'src/app/componentes/flujos/especializacion/gestion-delegados/gestion-delegados-especializacion.component';
import {
  InscripcionesEspecializacionComponent
} from 'src/app/componentes/flujos/especializacion/inscripciones/inscripciones-especializacion.component';
import {
  ReasignacionInscripcionEspecializacionComponent
} from 'src/app/componentes/flujos/especializacion/reasignacion-inscripcion/reasignacion-inscripcion-especializacion.component';
import { CrearCursoComponent } from "../../componentes/flujos/especializacion/crear-curso/crear-curso.component";
import {
  MenuAdministracionEspecializacionComponent
} from "../../componentes/flujos/especializacion/menus/menu-administracion-especializacion/menu-administracion-especializacion.component";
import {
  EstadoProcesoCursoComponent
} from "../../componentes/flujos/especializacion/estado-proceso-curso/estado-proceso-curso.component";
import {
  ValidacionCursoComponent
} from "../../componentes/flujos/especializacion/validacion-curso/validacion-curso.component";
import {
  ConvocatoriaEspecializacionComponent
} from "../../componentes/flujos/especializacion/convocatoria/convocatoria-especializacion.component";
import {
  DocumentosCursoComponent
} from "../../componentes/flujos/especializacion/documentos-curso/documentos-curso.component";

import {
  ListaPruebasCursoComponent
} from "../../componentes/flujos/especializacion/lista-pruebas-curso/lista-pruebas-curso.component";
import {
  ResultadosPruebasCursoComponent
} from "../../componentes/flujos/especializacion/resultados-pruebas-curso/resultados-pruebas-curso.component";
import {
  MenuPruebasEspecializacionComponent
} from "../../componentes/flujos/especializacion/menus/menu-pruebas-esp/menu-pruebas-especializacion.component";
import {
  MenuValidacionComponent
} from "../../componentes/flujos/especializacion/menus/menu-validacion/menu-validacion.component";
import {
  MenuConsultasEspComponent
} from "../../componentes/flujos/especializacion/menus/menu-consultas-esp/menu-consultas-esp.component";
import {
  MenuConvocatoriaEspecializacionComponent
} from "../../componentes/flujos/especializacion/menus/menu-convocatoria-esp/menu-convocatoria-especializacion.component";
import {
  MenuGestionComponent
} from "../../componentes/flujos/especializacion/menus/menu-gestion/menu-gestion.component";
import { MenuNotasComponent } from "../../componentes/flujos/especializacion/menus/menu-notas/menu-notas.component";


import { MenuEspecializacionAcademiaComponent } from '../../componentes/flujos/especializacion/academia/menu-academia/menu-especializacion-academia.component';
import { InstructoresEspecializacionComponent } from '../../componentes/flujos/especializacion/academia/instructores/instructores-especializacion.component';
import { RegistroNotasEspecializacionComponent } from '../../componentes/flujos/especializacion/academia/registro-notas/registro-notas-especializacion.component';
import {
  MenuReportesEspComponent
} from "../../componentes/flujos/especializacion/menus/menu-reportes-esp/menu-reportes-esp.component";
import {
  CursosCerradosComponent
} from "../../componentes/flujos/especializacion/cursos-cerrados/cursos-cerrados.component";
import {
  MenuCalculoNotaFinalComponent
} from "../../componentes/flujos/especializacion/menus/menu-calculo-nota-final/menu-calculo-nota-final.component";
import {EditarCursoComponent} from "../../componentes/flujos/especializacion/editar-curso/editar-curso.component";
import { UtilModule } from '../../componentes/util/util.module';
import {
  MenuAdmProComponent
} from "../../componentes/flujos/profesionalizacion/menus/menu-adm-pro/menu-adm-pro.component";
import {
  MenuConvocatoriaProComponent
} from "../../componentes/flujos/profesionalizacion/menus/menu-convocatoria-pro/menu-convocatoria-pro.component";
import {
  MenuRegistroNotasProComponent
} from "../../componentes/flujos/profesionalizacion/menus/menu-registro-notas-pro/menu-registro-notas-pro.component";
import {
  MenuReportesProComponent
} from "../../componentes/flujos/profesionalizacion/menus/menu-reportes-pro/menu-reportes-pro.component";
import {
  MenuValidacionProComponent
} from "../../componentes/flujos/profesionalizacion/menus/menu-validacion-pro/menu-validacion-pro.component";
import {UnidadGestionComponent} from "../../componentes/unidad-gestion/unidad-gestion.component";
import { EstacionTrabajoComponent } from '../../componentes/estacion-trabajo/estacion-trabajo.component';
import {
  MonitorInscripcionesComponent
} from "../../componentes/flujos/formacion/monitor-inscripciones/monitor-inscripciones.component";
import {
  MonitorInscripcionesCursoComponent
} from "../../componentes/flujos/especializacion/monitor-inscripciones-curso/monitor-inscripciones-curso.component";
import { CronogramaComponent } from "../../componentes/flujos/especializacion/cronograma/cronograma.component";
import {
  RepositorioMateriaEstudianteComponent
} from "../../componentes/pendiente/repositorio-materia-estudiante/repositorio-materia-estudiante.component";
import {
  CalendarioInstructorComponent
} from "../../componentes/pendiente/calendario-instructor/calendario-instructor.component";
import { ChatInstructorComponent } from "../../componentes/pendiente/chat-instructor/chat-instructor.component";
import {
  CursosTomadosComponent
} from "../../componentes/pendiente/especializacion/cursos-tomados/cursos-tomados.component";
import { LlamamientoDosComponent } from "../../componentes/pendiente/llamamiento-dos/llamamiento-dos.component";
import {
  EpsInstructorChatComponent
} from "../../componentes/pendiente/especializacion/eps-instructor-chat/eps-instructor-chat.component";
import {
  EspInsCalendarioComponent
} from "../../componentes/pendiente/especializacion/esp-ins-calendario/esp-ins-calendario.component";
import {
  EspApelacionesInsComponent
} from "../../componentes/pendiente/especializacion/esp-apelaciones-ins/esp-apelaciones-ins.component";
import {
  LlamamientoFichaComponent
} from "../../componentes/pendiente/llamamiento/llamamiento-ficha/llamamiento-ficha.component";
import {
  CursoEvaluacionesComponent
} from "../../componentes/pendiente/especializacion/evaluaciones/curso-evaluaciones/curso-evaluaciones.component";
import {
  IntMenuPrincipalComponent
} from "../../componentes/pendiente/integracion-bomberil/menus/int-menu-principal/int-menu-principal.component";
import {
  IntInformacionComponent
} from "../../componentes/pendiente/integracion-bomberil/int-informacion/int-informacion.component";
import {
  IntCapacitacionEmpresarialComponent
} from "../../componentes/pendiente/integracion-bomberil/int-capacitacion-empresarial/int-capacitacion-empresarial.component";
import {
  IntListaHonorComponent
} from "../../componentes/pendiente/integracion-bomberil/int-lista-honor/int-lista-honor.component";
import {
  IntVisualizacionBomberosComponent
} from "../../componentes/pendiente/integracion-bomberil/int-visualizacion-bomberos/int-visualizacion-bomberos.component";
import {
  IntSubidaReconocimientosComponent
} from "../../componentes/pendiente/integracion-bomberil/int-subida-reconocimientos/int-subida-reconocimientos.component";
import {
  IntAscensosComponent
} from "../../componentes/pendiente/integracion-bomberil/int-ascensos/int-ascensos.component";
import {
  IntNotificacionLlamamientoComponent
} from "../../componentes/pendiente/integracion-bomberil/int-notificacion-llamamiento/int-notificacion-llamamiento.component";
import {
  IntSancionesComponent
} from "../../componentes/pendiente/integracion-bomberil/int-sanciones/int-sanciones.component";

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
      { path: 'formacion/monitor-inscripciones', component: MonitorInscripcionesComponent},
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
      { path: 'formacion/academia/apelaciones', component: ApelacionesComponent },

      { path: 'paralelo', component: ParaleloComponent },
      { path: 'tipoInstruccion', component: TipoInstruccionComponent },
      { path: 'ponderacion', component: PonderacionComponent },
      { path: 'moduloEstados', component: ModuloEstadosComponent },
      { path: 'catalogo', component: CatalogoEstadosComponent },
      { path: 'estadoPeriodoAcademico', component: EstadoPeriodoAcademicoComponent },
      { path: 'formacion/proceso', component: ProcesoFormacionComponent },
      { path: 'convocatoria', component: ConvocatoriaComponent },
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
      { path: 'formacion/menu-consultas', component: MenuConsultasComponent },
      { path: 'formacion/periodo-academico', component: PeriodoAcademicoComponent },
      { path: 'formacion/estudiante/repositorio', component: RepositorioMateriaEstudianteComponent },
      { path: 'formacion/academia/calendario', component: CalendarioInstructorComponent },
      { path: 'formacion/academia/chat', component: ChatInstructorComponent },

      // llamamiento
      { path: 'formacion/llamamiento', component: LlamamientoDosComponent },
      { path: 'llamamiento-dos/notas-ficha', component: LlamamientoFichaComponent },

      // especialización

      { path: 'especializacion/proceso', component: ProcesoEspecializacionComponent },
      { path: 'especializacion/catalogo-curso', component: CatalogoCursoComponent },
      { path: 'especializacion/crear-curso', component: CrearCursoComponent },
      { path: 'especializacion/editar-curso', component: EditarCursoComponent },
      { path: 'especializacion/menu-validacion', component: MenuValidacionRequisitosEspecializacionComponent },
      { path: 'especializacion/validacion', component: ValidacionEspecializacionComponent },
      { path: 'especializacion/gestion-delegados', component: GestionDelegadosEspecializacionComponent },
      { path: 'especializacion/inscripciones', component: InscripcionesEspecializacionComponent },
      { path: 'especializacion/monitor-inscripciones-curso', component: MonitorInscripcionesCursoComponent },
      {
        path: 'especializacion/reasignacion-inscripciones',
        component: ReasignacionInscripcionEspecializacionComponent
      },
      { path: 'especializacion/menu-academia', component: MenuEspecializacionAcademiaComponent },
      { path: 'especializacion/academia/instructores', component: InstructoresEspecializacionComponent },
      { path: 'especializacion/academia/notas', component: RegistroNotasEspecializacionComponent },

      { path: 'especializacion/lista-pruebas-curso', component: ListaPruebasCursoComponent },
      { path: 'especializacion/resultado-pruebas-curso', component: ResultadosPruebasCursoComponent },

      { path: 'fichaPersonal', component: FichaPersonalComponent },
      { path: 'historicoModulo', component: HistoricoModuloComponent },

      { path: 'especializacion/cursos/estados', component: EstadoProcesoCursoComponent },
      { path: 'especializacion/validacion/curso', component: ValidacionCursoComponent },
      { path: 'especializacion/convocatoria', component: ConvocatoriaEspecializacionComponent },
      { path: 'especializacion/cursos/documentos/:estado', component: DocumentosCursoComponent },
      { path: 'especializacion/cursos/cerrados', component: CursosCerradosComponent },
      { path: 'especializacion/cursos/evaluaciones', component: CursoEvaluacionesComponent },

      { path: 'especializacion/menu-administracion', component: MenuAdministracionEspecializacionComponent },
      { path: 'especializacion/menu-pruebas-esp', component: MenuPruebasEspecializacionComponent },
      { path: 'especializacion/menu-validacion', component: MenuValidacionComponent },
      { path: 'especializacion/menu-consultas', component: MenuConsultasEspComponent },
      { path: 'especializacion/menu-convocatoria', component: MenuConvocatoriaEspecializacionComponent },
      { path: 'especializacion/menu-gestion', component: MenuGestionComponent },
      { path: 'especializacion/menu-notas', component: MenuNotasComponent },
      { path: 'especializacion/menu-reportes', component: MenuReportesEspComponent },
      { path: 'especializacion/menu-nota-final', component: MenuCalculoNotaFinalComponent },
      { path: 'especializacion/cronograma', component: CronogramaComponent },
      { path: 'especializacion/chat', component: EpsInstructorChatComponent},
      { path: 'especializacion/calendario', component: EspInsCalendarioComponent },
      { path: 'especializacion/apelaciones-ins', component: EspApelacionesInsComponent },


      { path: 'formacion/estudiante/cursos-tomados', component: CursosTomadosComponent },

      /* Profesionalizacion */
      { path: 'profesionalizacion/menu-administracion', component: MenuAdmProComponent},
      { path: 'profesionalizacion/menu-convocatoria', component: MenuConvocatoriaProComponent},
      { path: 'profesionalizacion/menu-validacion', component: MenuValidacionProComponent},
      { path: 'profesionalizacion/menu-academia', component: MenuRegistroNotasProComponent},
      { path: 'profesionalizacion/menu-reportes', component: MenuReportesProComponent},
      { path: 'profesionalizacion/unidad-gestion', component: UnidadGestionComponent},
      { path: 'profesionalizacion/estacion-trabajo', component: EstacionTrabajoComponent},

      /* Integracion bomberil */

      { path: 'integracion-bomberil/menu', component: IntMenuPrincipalComponent},
      { path: 'integracion-bomberil/capacitacion-empresarial', component: IntCapacitacionEmpresarialComponent},
      { path: 'integracion-bomberil/informacion', component: IntInformacionComponent},
      { path: 'integracion-bomberil/mencion-honorifica', component: IntSubidaReconocimientosComponent},
      { path: 'integracion-bomberil/bomberos', component: IntVisualizacionBomberosComponent},
      { path: 'integracion-bomberil/mejores', component: IntSubidaReconocimientosComponent},
      { path: 'integracion-bomberil/notificacion/ascensos', component: IntAscensosComponent},
      { path: 'integracion-bomberil/notificacion/llamamiento', component: IntNotificacionLlamamientoComponent},
      { path: 'integracion-bomberil/sanciones', component: IntSancionesComponent},

    ],
  },
];

@NgModule({
  declarations: [
    //MenuFormacionComponent,
    //MenuAdminComponent,
    //MenuItemComponent,
    //BotonVolverComponent,
  ],
  imports: [RouterModule.forChild(routes), CommonModule, UtilModule],
  exports: [RouterModule],
  providers: [MdbPopconfirmService, CambiosPendientesGuard, LocalDataService],
})
export class PrincipalModuleModule {
}
