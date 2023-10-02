import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrincipalComponent} from '../../principal/principal.component';
import {AutenticacionChildGuard} from '../../../guard/autenticacion-child.guard';
import { ReporteGeneralComponent } from '../../flujos/profesionalizacion/reportes/reporte-general/reporte-general.component';
import { ReporteNotasComponent } from '../../flujos/profesionalizacion/reportes/reporte-notas/reporte-notas.component';
import { MenuPrincipalComponent } from "../reporteria/menus/menu-principal/menu-principal.component";
import { ESPECIALIZACION, FORMACION, GENERAL, PROFESIONALIZACION } from 'src/app/modelo/dto/reporte.dto';
import { ReporteGenericoComponent } from './generico/reporte-generico.component';
import {MallaComponent} from "./malla/malla.component";

const routes: Routes = [
  {
    path: 'principal/reporteria', component: PrincipalComponent, canActivateChild: [AutenticacionChildGuard],
    children: [
      //MENU
      { path: 'menu', component: MenuPrincipalComponent},

      //GENERAL
      {
        path: 'general/cierre-bimestre', component: ReporteGenericoComponent, data: { codigo: GENERAL.CIERRE_BIMESTRE }
      },      {
        path: 'general/malla-curricular', component: MallaComponent, data: { codigo: GENERAL.GENERAL_MALLA }
      },      {
        path: 'general/reporte-general', component: MallaComponent, data: { codigo: GENERAL.GENERAL_GENERAL }
      },      {
        path: 'general/antiguedades', component: MallaComponent, data: { codigo: GENERAL.GENERAL_ANTIGUEDADES }
      },

      //FORMACION
      {
        path: 'formacion/calificaciones', component: ReporteGenericoComponent, data: { codigo: FORMACION.CALIFICACIONES }
      },
      {
        path: 'formacion/promedio', component: ReporteGenericoComponent, data: { codigo: FORMACION.PROMEDIO }
      },
      {
        path: 'formacion/equivalencia', component: ReporteGenericoComponent, data: { codigo: FORMACION.EQUIVALENCIA }
      },
      {
        path: 'formacion/participantes', component: ReporteGenericoComponent, data: { codigo: FORMACION.PARTICIPANTES }
      },
      {
        path: 'formacion/aprobados', component: MallaComponent, data: { codigo: FORMACION.APROBADOS }
      },

      //ESPECIALIZACION
      {
        path: 'especializacion/calificaciones', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.CALIFICACIONES }
      },
      {
        path: 'especializacion/promedio', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.PROMEDIO }
      },
      {
        path: 'especializacion/equivalencia', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.EQUIVALENCIA }
      },
      {
        path: 'especializacion/participantes', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.PARTICIPANTES }
      },
      {
        path: 'especializacion/cursos', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.CURSOS_TOTAL }
      },
      {
        path: 'especializacion/aprobados', component: MallaComponent, data: { codigo: ESPECIALIZACION.APROBADOS }
      },      {
        path: 'especializacion/evaluaciones', component: MallaComponent, data: { codigo: ESPECIALIZACION.EVALUACIONES }
      },

      //PROFESIONALIZACION
      {
        path: 'profesionalizacion/calificaciones', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.CALIFICACIONES }
      },
      {
        path: 'profesionalizacion/promedio', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.PROMEDIO }
      },
      {
        path: 'profesionalizacion/equivalencia', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.EQUIVALENCIA }
      },
      {
        path: 'profesionalizacion/participantes', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.PARTICIPANTES }
      },
      {
        path: 'profesionalizacion/reporte-materia-promocion', component: ReporteGeneralComponent,
      },
      {
        path: 'profesionalizacion/reporte-notas', component: ReporteNotasComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteriaRoutingModule {
}
