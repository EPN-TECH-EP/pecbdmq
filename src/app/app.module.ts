import { CatalogoEstados } from 'src/app/modelo/admin/catalogo-estados';
import { CatalogoEstadosComponent } from './componentes/catalogo-estados/catalogo-estados.component';
import { ModuloEstado } from './modelo/admin/modulo-estado';
import { TipoPrueba } from './modelo/admin/tipo-prueba';
import { Semestre } from 'src/app/modelo/admin/semestre';
import { Periodo } from './modelo/admin/periodo-academico';

import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// MDB Modules
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbAutocompleteModule } from 'mdb-angular-ui-kit/autocomplete';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbChartModule } from 'mdb-angular-ui-kit/charts';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDatepickerModule } from 'mdb-angular-ui-kit/datepicker';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbInfiniteScrollModule } from 'mdb-angular-ui-kit/infinite-scroll';
import { MdbLazyLoadingModule } from 'mdb-angular-ui-kit/lazy-loading';
import { MdbLightboxModule } from 'mdb-angular-ui-kit/lightbox';
import { MdbLoadingModule } from 'mdb-angular-ui-kit/loading';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationModule } from 'mdb-angular-ui-kit/notification';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRatingModule } from 'mdb-angular-ui-kit/rating';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollbarModule } from 'mdb-angular-ui-kit/scrollbar';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbSelectModule } from 'mdb-angular-ui-kit/select';
import { MdbSidenavModule } from 'mdb-angular-ui-kit/sidenav';
import { MdbSmoothScrollModule } from 'mdb-angular-ui-kit/smooth-scroll';
import { MdbStepperModule } from 'mdb-angular-ui-kit/stepper';
import { MdbStickyModule } from 'mdb-angular-ui-kit/sticky';
import { MdbTableModule } from 'mdb-angular-ui-kit/table';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTimepickerModule } from 'mdb-angular-ui-kit/timepicker';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { MdbMultiRangeModule } from 'mdb-angular-ui-kit/multi-range';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutenticacionService } from './servicios/autenticacion.service';
import { UsuarioService } from './servicios/usuario.service';
import { AutenticacionInterceptor } from './interceptor/autenticacion.interceptor';
import { AutenticacionGuard } from './guard/autenticacion.guard';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AlertaComponent } from './componentes/util/alerta/alerta.component';
import { PrincipalModuleModule } from './modulos/principal-module/principal-module.module';
import { UsuarioFrm } from './modelo/util/usuario-frm';
import { CargaArchivoComponent } from './componentes/util/carga-archivo/carga-archivo.component';
import { ErrorCatchingInterceptor } from './interceptor/error.interceptor';
import { MateriaComponent } from './componentes/materia/materia.component';
//import { UnidadGestionComponent } from './componentes/unidad-gestion/unidad-gestion.component';
import { UsuariosComponent } from './componentes/admin/administracion-plataforma/usuarios/usuarios.component';
import { RolUsuarioComponent } from './componentes/admin/administracion-plataforma/rol-usuario/rol-usuario.component';
import { TipoPruebaComponent } from './componentes/tipo-prueba/tipo-prueba.component';
import { AulasComponent } from './componentes/aulas/aulas.component';
import { SemestreComponent } from './componentes/semestre/semestre.component';
import { SemestreTbl } from './modelo/util/semestre-tbl';
import { ModuloComponent } from './componentes/modulo/modulo.component';
import { TipoDocumentoComponent } from './componentes/tipo-documento/tipo-documento.component';
import { TipoProcedenciaComponent } from './componentes/tipo-procedencia/tipo-procedencia.component';
import { PopconfirmComponent } from './componentes/util/popconfirm/popconfirm.component';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import {
  MenuProfesionalizacionComponent
} from './componentes/flujos/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { ValidacionComponent } from './componentes/flujos/formacion/validacion/validacion.component';
import { TipoDocumento } from './modelo/admin/tipo-documento';
//import { UnidadGestion } from './modelo/unidad-gestion';
import { TipoFuncionario } from './modelo/admin/tipo-funcionario';
import { Aula } from './modelo/admin/aula';
import { Materia } from './modelo/admin/materias';
import { TipoNota } from './modelo/admin/tipo-nota';
import { Modulo } from './modelo/admin/modulo';
//import { CustomRouteReuseStrategy } from './util/custom-route-reuse-strategy';
//import { RouteReuseStrategy } from '@angular/router';
import { TipoBajaComponent } from "./componentes/tipo-baja/tipo-baja.component";
//import { ITipoFalta} from "./modelo/admin/tipo_falta";
import { TipoFaltaComponent } from "./componentes/tipo-falta/tipo-falta.component";
import { ParaleloComponent } from "./componentes/paralelo/paralelo.component";
import { TipoInstruccionComponent } from "./componentes/tipo-instruccion/tipo-instruccion.component";
import { ComponenteNotaComponent } from './componentes/componente-nota/componente-nota.component';
import { ComponenteNota } from './modelo/admin/componente-nota';
import { DocumentosHabilitantes } from './modelo/admin/documentos-habilitantes';
import { Paralelo } from './modelo/admin/paralelo';
import { TipoProcedencia } from './modelo/admin/tipo-procedencia';
import { TipoInstruccion } from './modelo/admin/tipo_instruccion';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { PonderacionComponent } from './componentes/ponderacion/ponderacion.component';
import { ModuloEstadosComponent } from './componentes/modulo-estados/modulo-estados.component';

//import { RequisitoComponent } from './componentes/requisito/requisito.component';
import { MenuItemComponent } from './componentes/util/menu-item/menu-item.component';
import { ConvocatoriaComponent } from './componentes/flujos/formacion/convocatoria/convocatoria.component';
import { RequisitoComponent } from './componentes/requisito/requisito.component';
//import { Requisito } from './modelo/admin/requisito';
import {
  EstadoPeriodoAcademicoComponent
} from './componentes/estado-periodo-academico/estado-periodo-academico.component';
import { InscripcionComponent } from './componentes/flujos/formacion/inscripcion/inscripcion.component';
import { RolComponent } from './componentes/admin/administracion-plataforma/rol/rol.component';
import { MenuRolComponent } from './componentes/admin/administracion-plataforma/menu-rol/menu-rol.component';
import {
  MenuFormacionComponent
} from './componentes/flujos/formacion/menus/menu-administracion-formacion/menu-formacion.component';
import {
  ProcesoEspecializacionComponent
} from './componentes/flujos/especializacion/proceso-especializacion/proceso-especializacion.component';
import {
  ProcesoProfesionalizacionComponent
} from './componentes/flujos/profesionalizacion/proceso-profesionalizacion/proceso-profesionalizacion.component';
import {
  ProcesoFormacionComponent
} from "./componentes/flujos/formacion/menus/menu-proceso-formacion/proceso-formacion.component";
import { InputValidationDirective } from './directivas/input-validation.directive';
import { ExpiredTokenInterceptor } from "./interceptor/expired-token.interceptor";
import { PerfilComponent } from './componentes/user/perfil/perfil.component';
import {
  DatoPersonalComponent
} from './componentes/admin/administracion-plataforma/dato-personal/dato-personal.component';
import { UsuarioComponent } from './componentes/admin/administracion-plataforma/usuario/usuario.component';
import { ModalSesionExpiradaComponent } from './componentes/util/modal-sesion-expirada/modal-sesion-expirada.component';
import { MenuComponent } from './componentes/admin/administracion-plataforma/menu/menu.component';
import { MenuAdminComponent } from './componentes/admin/administracion-plataforma/menu-admin/menu-admin.component';
import {
  GestionDocumentosComponent
} from './componentes/flujos/formacion/gestion-documentos/gestion-documentos.component';
import {
  EstadoProcesoFormacionComponent
} from './componentes/flujos/formacion/estado-proceso/estado-proceso-formacion.component';
import {
  EstadoProcesoStepperComponent
} from './componentes/util/estado-proceso-stepper/estado-proceso-stepper.component';
import { InscripcionesComponent } from './componentes/flujos/formacion/inscripciones/inscripciones.component';
import {
  GestionDelegadosComponent
} from './componentes/flujos/formacion/gestion-delegados/gestion-delegados.component';
import {
  ReasignacionInscripcionComponent
} from './componentes/flujos/formacion/reasignacion-inscripcion/reasignacion-inscripcion.component';
import {
  MenuFormacionAcademiaComponent
} from './componentes/flujos/formacion/formacion-academica/menu-formacion-academia/menu-formacion-academia.component';
import {
  FaGestionDocumentosComponent
} from './componentes/flujos/formacion/formacion-academica/fa-gestion-documentos/fa-gestion-documentos.component';
import {
  InstructoresComponent
} from './componentes/flujos/formacion/formacion-academica/instructores/instructores.component';
import { BusquedaUsuarioComponent } from './componentes/util/busqueda-usuario/busqueda-usuario.component';

import { MateriasComponent } from './componentes/flujos/formacion/formacion-academica/materias/materias.component';

import { PruebasComponent } from './componentes/flujos/formacion/pruebas/pruebas.component';
import { SubtipoPruebaComponent } from './componentes/flujos/formacion/subtipo-prueba/subtipo-prueba.component';
import { ListaPruebasComponent } from './componentes/flujos/formacion/lista-pruebas/lista-pruebas.component';
import {
  SubtipoParametrosComponent
} from './componentes/flujos/formacion/subtipo-parametros/subtipo-parametros.component';
import {
  ResultadosPruebasComponent
} from './componentes/flujos/formacion/resultados-pruebas/resultados-pruebas.component';
import { MuestraComponent } from './componentes/flujos/formacion/muestra/muestra.component';
import {
  EstudiantesComponent
} from './componentes/flujos/formacion/formacion-academica/estudiantes/estudiantes.component';
import {
  RegistroNotasComponent
} from './componentes/flujos/formacion/formacion-academica/registro-notas/registro-notas.component';
import {
  RegistroNotasDisciplinariasComponent
} from './componentes/flujos/formacion/formacion-academica/registro-notas-disciplinarias/registro-notas-disciplinarias.component';
import {
  NotasEstudiantesComponent
} from './componentes/flujos/formacion/formacion-academica/notas-estudiantes/notas-estudiantes.component';
import {
  MenuConvocatoriaComponent
} from './componentes/flujos/formacion/menus/menu-convocatoria/menu-convocatoria.component';
import {
  MenuValidacionRequisitosComponent
} from './componentes/flujos/formacion/menus/menu-validacion-requisitos/menu-validacion-requisitos.component';
import { MenuPruebasComponent } from './componentes/flujos/formacion/menus/menu-pruebas/menu-pruebas.component';
import {
  MenuGraduacionComponent
} from './componentes/flujos/formacion/menus/menu-graduacion/menu-graduacion.component';
import { FichaPersonalComponent } from './componentes/user/ficha-personal/ficha-personal.component';
import { HistoricoModuloComponent } from './componentes/user/historico-modulo/historico-modulo.component';
import {
  ModalSansionComponent
} from './componentes/flujos/formacion/formacion-academica/modal-sansion/modal-sansion.component';
import {
  ComponenteNotaFormacion
} from './componentes/flujos/formacion/formacion-academica/componente-nota-formacion/componente-nota-formacion.component';
import { MenuConsultasComponent } from './componentes/flujos/formacion/menus/menu-consultas/menu-consultas.component';
import {
  PeriodoAcademicoComponent
} from './componentes/flujos/formacion/periodo-academico/periodo-academico.component';
import {
  ApelacionesComponent
} from './componentes/flujos/formacion/formacion-academica/apelaciones/apelaciones.component';
import { ModalApelacionComponent } from './componentes/util/modal-apelacion/modal-apelacion.component';
import { ListaCursosComponent } from './componentes/flujos/especializacion/util/lista-cursos/lista-cursos.component';
import { CatalogoCursoComponent } from './componentes/flujos/especializacion/catalogo-curso/catalogo-curso.component';
import { MenuValidacionRequisitosEspecializacionComponent } from './componentes/flujos/especializacion/menus/menu-validacion-requisitos/menu-validacion-requisitos-especializacion.component';
import { InscripcionesEspecializacionComponent } from './componentes/flujos/especializacion/inscripciones/inscripciones-especializacion.component';
import { ValidacionEspecializacionComponent } from './componentes/flujos/especializacion/validacion-especializacion/validacion-especializacion.component';
import { GestionDelegadosEspecializacionComponent } from './componentes/flujos/especializacion/gestion-delegados/gestion-delegados-especializacion.component';
import { ReasignacionInscripcionEspecializacionComponent } from './componentes/flujos/especializacion/reasignacion-inscripcion/reasignacion-inscripcion-especializacion.component';
import { CrearCursoComponent } from './componentes/flujos/especializacion/crear-curso/crear-curso.component';
import {
  MenuAdministracionEspecializacionComponent
} from './componentes/flujos/especializacion/menus/menu-administracion-especializacion/menu-administracion-especializacion.component';
import {
  EstadoProcesoCursoComponent
} from './componentes/flujos/especializacion/estado-proceso-curso/estado-proceso-curso.component';
import {
  InscripcionEspecializacionComponent
} from "./componentes/flujos/especializacion/inscripcion/inscripcion-especializacion.component";
import { ListaPruebasCursoComponent } from './componentes/flujos/especializacion/lista-pruebas-curso/lista-pruebas-curso.component';
import { ResultadosPruebasCursoComponent } from './componentes/flujos/especializacion/resultados-pruebas-curso/resultados-pruebas-curso.component';
import {
  ValidacionCursoComponent
} from './componentes/flujos/especializacion/validacion-curso/validacion-curso.component';
import { BooleanPipe } from './pipes/boolean.pipe';
import {
  ConvocatoriaEspecializacionComponent
} from "./componentes/flujos/especializacion/convocatoria/convocatoria-especializacion.component";
import { DocumentosCursoComponent } from './componentes/flujos/especializacion/documentos-curso/documentos-curso.component';

import {
  MenuPruebasEspecializacionComponent
} from "./componentes/flujos/especializacion/menus/menu-pruebas-esp/menu-pruebas-especializacion.component";
import { MenuGestionComponent } from './componentes/flujos/especializacion/menus/menu-gestion/menu-gestion.component';
import { MenuValidacionComponent } from './componentes/flujos/especializacion/menus/menu-validacion/menu-validacion.component';
import { MenuNotasComponent } from './componentes/flujos/especializacion/menus/menu-notas/menu-notas.component';
import { MenuConsultasEspComponent } from './componentes/flujos/especializacion/menus/menu-consultas-esp/menu-consultas-esp.component';
import {
  MenuConvocatoriaEspecializacionComponent
} from "./componentes/flujos/especializacion/menus/menu-convocatoria-esp/menu-convocatoria-especializacion.component";

import { InstructoresEspecializacionComponent } from './componentes/flujos/especializacion/academia/instructores/instructores-especializacion.component';
import { MenuEspecializacionAcademiaComponent } from './componentes/flujos/especializacion/academia/menu-academia/menu-especializacion-academia.component';
import { RegistroNotasEspecializacionComponent } from './componentes/flujos/especializacion/academia/registro-notas/registro-notas-especializacion.component';
import { MenuReportesEspComponent } from './componentes/flujos/especializacion/menus/menu-reportes-esp/menu-reportes-esp.component';
import { CursosCerradosComponent } from './componentes/flujos/especializacion/cursos-cerrados/cursos-cerrados.component';
import { MenuCalculoNotaFinalComponent } from './componentes/flujos/especializacion/menus/menu-calculo-nota-final/menu-calculo-nota-final.component';
import { EditarCursoComponent } from './componentes/flujos/especializacion/editar-curso/editar-curso.component';
import { ProfesionalizacionModule } from './componentes/flujos/profesionalizacion/profesionalizacion.module';
import { UtilModule } from './componentes/util/util.module';
import { MonitorInscripcionesComponent } from './componentes/flujos/formacion/monitor-inscripciones/monitor-inscripciones.component';
import { MonitorInscripcionesCursoComponent } from './componentes/flujos/especializacion/monitor-inscripciones-curso/monitor-inscripciones-curso.component';
import { CronogramaComponent } from './componentes/flujos/especializacion/cronograma/cronograma.component';
import { CronogramaAdminComponent } from './componentes/flujos/especializacion/cronograma-admin/cronograma-admin.component';
import { InfoCursoComponent } from './componentes/flujos/especializacion/info-curso/info-curso.component';
import { ResultadosInscripcionesComponent } from './componentes/pendiente/resultados-inscripciones/resultados-inscripciones.component';
import { ModalApeliacionNotaComponent } from './componentes/pendiente/modal-apeliacion-nota/modal-apeliacion-nota.component';
import { CalendarioFormacionComponent } from './componentes/pendiente/calendario-formacion/calendario-formacion.component';
import { registerLocaleData } from "@angular/common";

import localeEs from '@angular/common/locales/es';
import { FullCalendarModule } from "@fullcalendar/angular";
import { RepositorioMateriaEstudianteComponent } from './componentes/pendiente/repositorio-materia-estudiante/repositorio-materia-estudiante.component';
import { CalendarioInstructorComponent } from './componentes/pendiente/calendario-instructor/calendario-instructor.component';
import { ChatInstructorComponent } from './componentes/pendiente/chat-instructor/chat-instructor.component';
import { CursosTomadosComponent } from './componentes/pendiente/especializacion/cursos-tomados/cursos-tomados.component';
import { LlamamientoDosComponent } from './componentes/pendiente/llamamiento-dos/llamamiento-dos.component';
import { LlamamientoFichaComponent } from './componentes/pendiente/llamamiento/llamamiento-ficha/llamamiento-ficha.component';
import { ModalLlamamientoRequisitosComponent } from './componentes/pendiente/llamamiento/modal-llamamiento-requisitos/modal-llamamiento-requisitos.component';
import { EpsInstructorChatComponent } from './componentes/pendiente/especializacion/eps-instructor-chat/eps-instructor-chat.component';
import { EspInsCalendarioComponent } from './componentes/pendiente/especializacion/esp-ins-calendario/esp-ins-calendario.component';
import { EspApelacionesInsComponent } from './componentes/pendiente/especializacion/esp-apelaciones-ins/esp-apelaciones-ins.component';
import { ModalLlamamientoSancionComponent } from './componentes/pendiente/llamamiento/modal-llamamiento-sancion/modal-llamamiento-sancion.component';
import { CursoEvaluacionesComponent } from './componentes/pendiente/especializacion/evaluaciones/curso-evaluaciones/curso-evaluaciones.component';
import { EstudianteEvalucionCursoComponent } from './componentes/pendiente/especializacion/evaluaciones/estudiante-evalucion-curso/estudiante-evalucion-curso.component';
import { IntMenuPrincipalComponent } from './componentes/pendiente/integracion-bomberil/menus/int-menu-principal/int-menu-principal.component';
import { IntCapacitacionEmpresarialComponent } from './componentes/pendiente/integracion-bomberil/int-capacitacion-empresarial/int-capacitacion-empresarial.component';
import { IntInformacionComponent } from './componentes/pendiente/integracion-bomberil/int-informacion/int-informacion.component';
import { IntSubidaReconocimientosComponent } from './componentes/pendiente/integracion-bomberil/int-subida-reconocimientos/int-subida-reconocimientos.component';
import { IntVisualizacionBomberosComponent } from './componentes/pendiente/integracion-bomberil/int-visualizacion-bomberos/int-visualizacion-bomberos.component';
import { IntListaHonorComponent } from './componentes/pendiente/integracion-bomberil/int-lista-honor/int-lista-honor.component';
import { IntAscensosComponent } from './componentes/pendiente/integracion-bomberil/int-ascensos/int-ascensos.component';
import { IntNotificacionLlamamientoComponent } from './componentes/pendiente/integracion-bomberil/int-notificacion-llamamiento/int-notificacion-llamamiento.component';
import { IntSancionesComponent } from './componentes/pendiente/integracion-bomberil/int-sanciones/int-sanciones.component';
import { ModalCargaReconocimientoComponent } from './componentes/pendiente/integracion-bomberil/util/modal-carga-reconocimiento/modal-carga-reconocimiento.component';
import { ModalSancionesBomberosComponent } from './componentes/pendiente/integracion-bomberil/util/modal-sanciones-bomberos/modal-sanciones-bomberos.component';
import { ReporteriaModule } from './componentes/pendiente/reporteria/reporteria.module';
import { ForRepoMateriaComponent } from './componentes/pendiente/formacion/for-repo-materia/for-repo-materia.component';
import { ForRepoEstudianteComponent } from './componentes/pendiente/formacion/for-repo-estudiante/for-repo-estudiante.component';
import { EpsRepoEstudianteComponent } from './componentes/pendiente/especializacion/eps-repo-estudiante/eps-repo-estudiante.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrincipalComponent,
    RegistroComponent,
    AlertaComponent,
    CargaArchivoComponent,
    MateriaComponent,
    //UnidadGestionComponent,
    UsuariosComponent,
    RolUsuarioComponent,
    TipoPruebaComponent,
    AulasComponent,
    SemestreComponent,
    ModuloComponent,
    TipoDocumentoComponent,
    TipoProcedenciaComponent,
    TipoBajaComponent,
    TipoFaltaComponent,
    PopconfirmComponent,
    MenuFormacionComponent,
    MenuAdminComponent,
    BienvenidaComponent,
    ValidacionComponent,
    ParaleloComponent,
    TipoInstruccionComponent,
    ComponenteNotaComponent,
    ParaleloComponent,
    TipoFaltaComponent,
    PonderacionComponent,
    ModuloEstadosComponent,
    RequisitoComponent,
    CatalogoEstadosComponent,
    ConvocatoriaComponent,
    RequisitoComponent,
    //MenuItemComponent,
    EstadoPeriodoAcademicoComponent,
    InscripcionComponent,
    RolComponent,
    MenuRolComponent,
    ProcesoEspecializacionComponent,
    //ProcesoProfesionalizacionComponent,
    ProcesoFormacionComponent,
    InputValidationDirective,
    PerfilComponent,
    DatoPersonalComponent,
    UsuarioComponent,
    ModalSesionExpiradaComponent,
    MenuComponent,
    GestionDocumentosComponent,
    EstadoProcesoFormacionComponent,
    EstadoProcesoStepperComponent,
    InscripcionesComponent,
    GestionDelegadosComponent,
    ReasignacionInscripcionComponent,
    MenuFormacionAcademiaComponent,
    FaGestionDocumentosComponent,
    InstructoresComponent,
    //BusquedaUsuarioComponent,
    MateriasComponent,
    PruebasComponent,
    SubtipoPruebaComponent,
    ListaPruebasComponent,
    SubtipoParametrosComponent,
    ResultadosPruebasComponent,
    MuestraComponent,
    EstudiantesComponent,
    RegistroNotasComponent,
    RegistroNotasDisciplinariasComponent,
    NotasEstudiantesComponent,
    MenuConvocatoriaComponent,
    MenuValidacionRequisitosComponent,
    MenuPruebasComponent,
    MenuGraduacionComponent,
    FichaPersonalComponent,
    HistoricoModuloComponent,
    ModalSansionComponent,
    ComponenteNotaFormacion,
    MenuConsultasComponent,
    PeriodoAcademicoComponent,
    ApelacionesComponent,
    ModalApelacionComponent,
    MenuValidacionRequisitosEspecializacionComponent,
    InscripcionesEspecializacionComponent,
    ValidacionEspecializacionComponent,
    GestionDelegadosEspecializacionComponent,
    ReasignacionInscripcionEspecializacionComponent,
    ListaCursosComponent,
    CatalogoCursoComponent,
    CrearCursoComponent,
    MenuAdministracionEspecializacionComponent,
    EstadoProcesoCursoComponent,
    InscripcionEspecializacionComponent,
    ListaPruebasCursoComponent,
    ResultadosPruebasCursoComponent,
    ValidacionCursoComponent,
    BooleanPipe,
    ConvocatoriaEspecializacionComponent,
    DocumentosCursoComponent,
    MenuPruebasEspecializacionComponent,
    MenuGestionComponent,
    MenuValidacionComponent,
    MenuNotasComponent,
    MenuConsultasEspComponent,
    MenuConvocatoriaEspecializacionComponent,

    InstructoresEspecializacionComponent,
    MenuEspecializacionAcademiaComponent,
    RegistroNotasEspecializacionComponent,
    MenuReportesEspComponent,
    CursosCerradosComponent,
    MenuCalculoNotaFinalComponent,
    EditarCursoComponent,
    MonitorInscripcionesComponent,
    MonitorInscripcionesCursoComponent,
    CronogramaComponent,
    CronogramaAdminComponent,
    InfoCursoComponent,
    ResultadosInscripcionesComponent,
    ModalApeliacionNotaComponent,
    CalendarioFormacionComponent,
    RepositorioMateriaEstudianteComponent,
    CalendarioInstructorComponent,
    ChatInstructorComponent,
    CursosTomadosComponent,
    LlamamientoDosComponent,
    LlamamientoFichaComponent,
    ModalLlamamientoRequisitosComponent,
    EpsInstructorChatComponent,
    EspInsCalendarioComponent,
    EspApelacionesInsComponent,
    ModalLlamamientoSancionComponent,
    CursoEvaluacionesComponent,
    EstudianteEvalucionCursoComponent,
    IntMenuPrincipalComponent,
    IntCapacitacionEmpresarialComponent,
    IntInformacionComponent,
    IntSubidaReconocimientosComponent,
    IntVisualizacionBomberosComponent,
    IntListaHonorComponent,
    IntAscensosComponent,
    IntNotificacionLlamamientoComponent,
    IntSancionesComponent,
    ModalCargaReconocimientoComponent,
    ModalSancionesBomberosComponent,
    ForRepoMateriaComponent,
    ForRepoEstudianteComponent,
    EpsRepoEstudianteComponent,

    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // MDB
    MdbAccordionModule,
    MdbAutocompleteModule,
    MdbCarouselModule,
    MdbChartModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDatepickerModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbInfiniteScrollModule,
    MdbLazyLoadingModule,
    MdbLightboxModule,
    MdbLoadingModule,
    MdbModalModule,
    MdbNotificationModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRatingModule,
    MdbRippleModule,
    MdbScrollbarModule,
    MdbScrollspyModule,
    MdbSelectModule,
    MdbSidenavModule,
    MdbSmoothScrollModule,
    MdbStepperModule,
    MdbStickyModule,
    MdbTableModule,
    MdbTabsModule,
    MdbTimepickerModule,
    MdbTooltipModule,
    MdbValidationModule,
    MdbMultiRangeModule,
    //
    PrincipalModuleModule,
    ProfesionalizacionModule,
    ReporteriaModule,
    UtilModule,
    FullCalendarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    AutenticacionGuard,
    AutenticacionService,
    //{provide: HTTP_INTERCEPTORS, useClass: ErrorCatchingInterceptor, multi: true},
    UsuarioService, { provide: HTTP_INTERCEPTORS, useClass: AutenticacionInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExpiredTokenInterceptor,
      multi: true,
    },
    UsuarioFrm,
    Periodo,
    SemestreTbl,
    TipoDocumento,
    //UnidadGestion,
    Aula,
    Materia,
    TipoNota,
    Modulo,
    ComponenteNota,
    DocumentosHabilitantes,
    Paralelo,
    TipoProcedencia,
    TipoInstruccion,
    MdbPopconfirmService,
    Semestre,
    TipoPrueba,
    ModuloEstado,
    CatalogoEstados

    //{ provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
