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
    path: 'principal/reporteria', component: PrincipalComponent, canActivateChild: [AutenticacionChildGuard],
    children: [
      //MENU
      { path: 'menu', component: MenuPrincipalComponent},

      //GENERAL
      {
        path: 'general/cierre-bimestre', component: ReporteGenericoComponent, data: { codigo: GENERAL.CIERRE_BIMESTRE }
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
