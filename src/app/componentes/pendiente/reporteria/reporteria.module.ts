import {NgModule} from '@angular/core';
import {AutenticacionGuard} from '../../../guard/autenticacion.guard';
import {AutenticacionService} from '../../../servicios/autenticacion.service';
import {UsuarioService} from '../../../servicios/usuario.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AutenticacionInterceptor} from '../../../interceptor/autenticacion.interceptor';
import {TimeoutInterceptor} from '../../../interceptor/timeout.interceptor';
import {ExpiredTokenInterceptor} from '../../../interceptor/expired-token.interceptor';
import {UsuarioFrm} from '../../../modelo/util/usuario-frm';
import {Periodo} from '../../../modelo/admin/periodo-academico';
import {SemestreTbl} from '../../../modelo/util/semestre-tbl';
import {TipoDocumento} from '../../../modelo/admin/tipo-documento';
import {TipoFuncionario} from '../../../modelo/admin/tipo-funcionario';
import {Aula} from '../../../modelo/admin/aula';
import {Materia} from '../../../modelo/admin/materias';
import {TipoNota} from '../../../modelo/admin/tipo-nota';
import {Modulo} from '../../../modelo/admin/modulo';
import {ComponenteNota} from '../../../modelo/admin/componente-nota';
import {DocumentosHabilitantes} from '../../../modelo/admin/documentos-habilitantes';
import {Paralelo} from '../../../modelo/admin/paralelo';
import {TipoProcedencia} from '../../../modelo/admin/tipo-procedencia';
import {TipoInstruccion} from '../../../modelo/admin/tipo_instruccion';
import {MdbPopconfirmService} from 'mdb-angular-ui-kit/popconfirm';
import {Semestre} from '../../../modelo/admin/semestre';
import {TipoPrueba} from '../../../modelo/admin/tipo-prueba';
import {ModuloEstado} from '../../../modelo/admin/modulo-estado';
import {CatalogoEstados} from '../../../modelo/admin/catalogo-estados';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../../../app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MdbAccordionModule} from 'mdb-angular-ui-kit/accordion';
import {MdbAutocompleteModule} from 'mdb-angular-ui-kit/autocomplete';
import {MdbCarouselModule} from 'mdb-angular-ui-kit/carousel';
import {MdbChartModule} from 'mdb-angular-ui-kit/charts';
import {MdbCheckboxModule} from 'mdb-angular-ui-kit/checkbox';
import {MdbCollapseModule} from 'mdb-angular-ui-kit/collapse';
import {MdbDatepickerModule} from 'mdb-angular-ui-kit/datepicker';
import {MdbDropdownModule} from 'mdb-angular-ui-kit/dropdown';
import {MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import {MdbInfiniteScrollModule} from 'mdb-angular-ui-kit/infinite-scroll';
import {MdbLazyLoadingModule} from 'mdb-angular-ui-kit/lazy-loading';
import {MdbLightboxModule} from 'mdb-angular-ui-kit/lightbox';
import {MdbLoadingModule} from 'mdb-angular-ui-kit/loading';
import {MdbModalModule} from 'mdb-angular-ui-kit/modal';
import {MdbNotificationModule} from 'mdb-angular-ui-kit/notification';
import {MdbPopoverModule} from 'mdb-angular-ui-kit/popover';
import {MdbRadioModule} from 'mdb-angular-ui-kit/radio';
import {MdbRangeModule} from 'mdb-angular-ui-kit/range';
import {MdbRatingModule} from 'mdb-angular-ui-kit/rating';
import {MdbRippleModule} from 'mdb-angular-ui-kit/ripple';
import {MdbScrollbarModule} from 'mdb-angular-ui-kit/scrollbar';
import {MdbScrollspyModule} from 'mdb-angular-ui-kit/scrollspy';
import {MdbSelectModule} from 'mdb-angular-ui-kit/select';
import {MdbSidenavModule} from 'mdb-angular-ui-kit/sidenav';
import {MdbSmoothScrollModule} from 'mdb-angular-ui-kit/smooth-scroll';
import {MdbStepperModule} from 'mdb-angular-ui-kit/stepper';
import {MdbStickyModule} from 'mdb-angular-ui-kit/sticky';
import {MdbTableModule} from 'mdb-angular-ui-kit/table';
import {MdbTabsModule} from 'mdb-angular-ui-kit/tabs';
import {MdbTimepickerModule} from 'mdb-angular-ui-kit/timepicker';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';
import {MdbValidationModule} from 'mdb-angular-ui-kit/validation';
import {MdbMultiRangeModule} from 'mdb-angular-ui-kit/multi-range';
import {CommonComponentsModule} from '../../../common/common-components.module';
import {CommonModule} from '@angular/common';
import { UtilModule } from '../../util/util.module';
import { ReporteriaRoutingModule } from './reporteria-routing.module';
import { ReporteGeneralComponent } from '../../flujos/profesionalizacion/reportes/reporte-general/reporte-general.component';
import { ReporteNotasComponent } from '../../flujos/profesionalizacion/reportes/reporte-notas/reporte-notas.component';
import { MenuPrincipalComponent } from './menus/menu-principal/menu-principal.component';
import { ReporteGenericoComponent } from './generico/reporte-generico.component';


@NgModule({
  declarations: [
    ReporteGeneralComponent,
    ReporteNotasComponent,
    ReporteGenericoComponent,
    MenuPrincipalComponent,
  ],
  imports: [
    CommonModule,
    ReporteriaRoutingModule,
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
    CommonComponentsModule,
    UtilModule,
  ],
  providers: [
    AutenticacionGuard,
    AutenticacionService,
    UsuarioService, {provide: HTTP_INTERCEPTORS, useClass: AutenticacionInterceptor, multi: true},
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
    // UnidadGestion,
    TipoFuncionario,
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
  ]
})
export class ReporteriaModule {
}
