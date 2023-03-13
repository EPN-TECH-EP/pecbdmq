import { Periodo } from './modelo/periodo_academico';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
import { UnidadGestionComponent } from './componentes/unidad-gestion/unidad-gestion.component';
import { UsuariosComponent } from './componentes/admin/usuarios/usuarios.component';
import { RolesUsuariosComponent } from './componentes/admin/roles-usuarios/roles-usuarios.component';
import { TipoPruebaComponent } from './componentes/tipo-prueba/tipo-prueba.component';
import { AulasComponent } from './componentes/aulas/aulas.component';
import { PeriodoAcademicoComponent } from './componentes/periodo-academico/periodo-academico.component';
import { SemestreComponent } from './componentes/semestre/semestre.component';
import { SemestreTbl } from './modelo/util/semestre-tbl';
import { ModuloComponent } from './componentes/modulo/modulo.component';
import { TipoFuncionarioComponent } from './componentes/tipo-funcionario/tipo-funcionario.component';
import { TipoDocumentoComponent } from './componentes/tipo-documento/tipo-documento.component';
import { TipoProcedenciaComponent } from './componentes/tipo-procedencia/tipo-procedencia.component';
import { TipoNotaComponent } from './componentes/tipo-nota/tipo-nota.component';
import { PopconfirmComponent } from './componentes/util/popconfirm/popconfirm.component';
import { MdbPopconfirmService } from 'mdb-angular-ui-kit/popconfirm';
import { MenuEspecializacionComponent } from './componentes/especializacion/menu-especializacion/menu-especializacion.component';
import { MenuProfesionalizacionComponent } from './componentes/profesionalizacion/menu-profesionalizacion/menu-profesionalizacion.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { ValidacionComponent } from './componentes/formacion/validacion/validacion.component';
import { TipoDocumento } from './modelo/tipo-documento';
import { UnidadGestion } from './modelo/unidad-gestion';
import { TipoFuncionario } from './modelo/tipo-funcionario';
import { Aula } from './modelo/aula';
import { Materia } from './modelo/materias';
import { TipoNota } from './modelo/tipo-nota';
import { Modulo } from './modelo/modulo';
import {ParaleloComponent} from "./componentes/paralelo/paralelo.component";
import {TipoInstruccionComponent} from "./componentes/tipo-instruccion/tipo-instruccion.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrincipalComponent,
    RegistroComponent,
    AlertaComponent,
    CargaArchivoComponent,
    MateriaComponent,
    UnidadGestionComponent,
    UsuariosComponent,
    RolesUsuariosComponent,
    TipoPruebaComponent,
    AulasComponent,
    PeriodoAcademicoComponent,
    SemestreComponent,
    ModuloComponent,
    TipoFuncionarioComponent,
    TipoDocumentoComponent,
    TipoProcedenciaComponent,
    TipoNotaComponent,
    PopconfirmComponent,
    MenuEspecializacionComponent,
    MenuProfesionalizacionComponent,
    BienvenidaComponent,
    ValidacionComponent,
    ParaleloComponent,
    TipoInstruccionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
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
    PrincipalModuleModule
  ],
  providers: [
    AutenticacionGuard,
    AutenticacionService,
    //{provide: HTTP_INTERCEPTORS, useClass: ErrorCatchingInterceptor, multi: true},
    UsuarioService, {provide: HTTP_INTERCEPTORS, useClass: AutenticacionInterceptor, multi: true},
    UsuarioFrm,
    Periodo,
    SemestreTbl,
    TipoDocumento,
    UnidadGestion,
    TipoFuncionario,
    Aula,
    Materia,
    TipoNota,
    Modulo,
    MdbPopconfirmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
