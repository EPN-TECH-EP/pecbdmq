import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrincipalComponent} from '../../principal/principal.component';
import {AutenticacionChildGuard} from '../../../guard/autenticacion-child.guard';
import { ReporteGeneralComponent } from '../../flujos/profesionalizacion/reportes/reporte-general/reporte-general.component';
import { ReporteNotasComponent } from '../../flujos/profesionalizacion/reportes/reporte-notas/reporte-notas.component';
import { MenuPrincipalComponent } from "../reporteria/menus/menu-principal/menu-principal.component";
import { ESPECIALIZACION, FORMACION, GENERAL, PROFESIONALIZACION } from 'src/app/modelo/dto/reporte.dto';
import { ReporteGenericoComponent } from './generico/reporte-generico.component';

const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent, canActivateChild: [AutenticacionChildGuard],
    children: [
      //MENU
      { path: 'reporteria/menu', component: MenuPrincipalComponent},

      //GENERAL
      {
        path: 'reporteria/general/cierre-bimestre', component: ReporteGenericoComponent, data: { codigo: GENERAL.CIERRE_BIMESTRE }
      },      {
        path: 'reporteria/general/malla-curricular', component: ReporteGenericoComponent, data: { codigo: GENERAL.GENERAL_MALLA }
      },      {
        path: 'reporteria/general/reporte-general', component: ReporteGenericoComponent, data: { codigo: GENERAL.GENERAL_GENERAL }
      },      {
        path: 'reporteria/general/antiguedades', component: ReporteGenericoComponent, data: { codigo: GENERAL.GENERAL_ANTIGUEDADES }
      },

      //FORMACION
      {
        path: 'reporteria/formacion/calificaciones', component: ReporteGenericoComponent, data: { codigo: FORMACION.CALIFICACIONES }
      },
      {
        path: 'reporteria/formacion/promedio', component: ReporteGenericoComponent, data: { codigo: FORMACION.PROMEDIO }
      },
      {
        path: 'reporteria/formacion/equivalencia', component: ReporteGenericoComponent, data: { codigo: FORMACION.EQUIVALENCIA }
      },
      {
        path: 'reporteria/formacion/participantes', component: ReporteGenericoComponent, data: { codigo: FORMACION.PARTICIPANTES }
      },
      {
        path: 'reporteria/formacion/aprobados', component: ReporteGenericoComponent, data: { codigo: FORMACION.APROBADOS }
      },

      //ESPECIALIZACION
      {
        path: 'reporteria/especializacion/calificaciones', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.CALIFICACIONES }
      },
      {
        path: 'reporteria/especializacion/promedio', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.PROMEDIO }
      },
      {
        path: 'reporteria/especializacion/equivalencia', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.EQUIVALENCIA }
      },
      {
        path: 'reporteria/especializacion/participantes', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.PARTICIPANTES }
      },
      {
        path: 'reporteria/especializacion/cursos', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.CURSOS_TOTAL }
      },
      {
        path: 'reporteria/especializacion/aprobados', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.APROBADOS }
      },
      {
        path: 'reporteria/especializacion/evaluaciones', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.EVALUACIONES }
      },

      //PROFESIONALIZACION
      {
        path: 'reporteria/profesionalizacion/calificaciones', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.CALIFICACIONES }
      },
      {
        path: 'reporteria/profesionalizacion/promedio', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.PROMEDIO }
      },
      {
        path: 'reporteria/profesionalizacion/equivalencia', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.EQUIVALENCIA }
      },
      {
        path: 'reporteria/profesionalizacion/participantes', component: ReporteGenericoComponent, data: { codigo: PROFESIONALIZACION.PARTICIPANTES }
      },
      {
        path: 'reporteria/profesionalizacion/reporte-materia-promocion', component: ReporteGeneralComponent,
      },
      {
        path: 'reporteria/profesionalizacion/reporte-notas', component: ReporteNotasComponent,
      },
      //CAPACITACION
      {
        path: 'reporteria/capacitacion/total-capacitaciones', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.CURSOS_TOTAL }
      },
      {
        path: 'reporteria/capacitacion/participantes', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.PARTICIPANTES }
      },
      {
        path: 'reporteria/capacitacion/empresas', component: ReporteGenericoComponent, data: { codigo: ESPECIALIZACION.EMPRESAS }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteriaRoutingModule {
}
