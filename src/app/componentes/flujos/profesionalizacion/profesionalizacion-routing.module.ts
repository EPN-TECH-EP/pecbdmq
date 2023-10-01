import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrincipalComponent} from '../../principal/principal.component';
import {AutenticacionChildGuard} from '../../../guard/autenticacion-child.guard';
import {MenuProfesionalizacionComponent} from './menu-profesionalizacion/menu-profesionalizacion.component';
import {ProMateriaComponent} from './materia/pro-materia.component';
import {ProParaleloComponent} from './paralelo/pro-paralelo.component';
import {ProInstructoresComponent} from './pro-instructores/pro-instructores.component';
import {ProSemestreComponent} from './pro-semestre/pro-semestre.component';
import {ProMateriaSemestreComponent} from './pro-semestre-materia/pro-materia-semestre.component';
import {ProEstudianteSemestreComponent} from './pro-estudiante-semestre/pro-estudiante-semestre.component';
import {ProEstSemMatComponent} from './pro-est-sem-mat/pro-est-sem-mat.component';
import {ProConvocatoriaComponent} from './pro-convocatoria/pro-convocatoria.component';
import {TipoProyectoComponent} from './tipo-proyecto/tipo-proyecto.component';
import {ProyectoComponent} from './pro-proyecto/pro-proyecto.component';
import {ProEstSemMatParaleloComponent} from './pro-est-sem-mat-paralelo/pro-est-sem-mat-paralelo.component';
import {ProDelegadosComponent} from "./pro-delegados/pro-delegados.component";
import {ProPeriodoComponent} from './pro-periodo/pro-periodo.component';
import {ProInscripcionComponent} from './pro-inscripcion/pro-inscripcion.component';
import {ProInscripcionDelegadoComponent} from './pro-inscripcion-delegado/pro-inscripcion-delegado.component';
import {EtapasComponent} from "./pro-etapas/pro-etapas.component";
import {ProPeriodoSemestreComponent} from "./pro-periodo-semestre/pro-periodo-semestre.component";
import {ProParaleloMateriaComponent} from "./pro-paralelo-materia/pro-paralelo-materia.component";
import {ProEstudiantesParaleloComponent} from "./pro-estudiantes-paralelo/pro-estudiantes-paralelo.component";
import {ProParaleloInstructorComponent} from "./pro-paralelo-instructor/pro-paralelo-instructor.component";
import {ProNotaMateriaComponent} from './pro-nota-materia/pro-nota-materia.component';
import {ProPeriodoEstudianteComponent} from "./pro-periodo-estudiante/pro-periodo-estudiante.component";
import {ProSemestreEstudianteComponent} from "./pro-semestre-estudiante/pro-semestre-estudiante.component";
import {ProListadoInscripcionDelegadoComponent} from "./pro-listado-inscripcion-delegado/pro-listado-inscripcion-delegado.component";
import {ProNotaFinalComponent} from './pro-nota-final/pro-nota-final.component';
import {ProFlujoComponent} from "./pro-flujo/pro-flujo.component";

const routes: Routes = [
  {
    path: 'principal', component: PrincipalComponent, canActivateChild: [AutenticacionChildGuard],
    children: [
      {
        path: 'menuProfesionalizacion',
        component: MenuProfesionalizacionComponent,
      },
      {
        path: 'profesionalizacion/materia', component: ProMateriaComponent,
      },
      {
        path: 'profesionalizacion/academia/instructores', component: ProInstructoresComponent, // TODO fix new endpoints
      },
      {
        path: 'profesionalizacion/paralelo', component: ProParaleloComponent,
      },
      {
        path: 'profesionalizacion/semestre', component: ProSemestreComponent,
      },
      {
        path: 'profesionalizacion/materia-semestre', component: ProMateriaSemestreComponent,
      },
      {
        path: 'profesionalizacion/estudiante-semestre', component: ProEstudianteSemestreComponent,
      },
      {
        path: 'profesionalizacion/estudiante-semestre-materia', component: ProEstSemMatComponent,
      },
      {
        path: 'profesionalizacion/convocatoria', component: ProConvocatoriaComponent,
      },
      {
        path: 'profesionalizacion/tipo-proyecto', component: TipoProyectoComponent,
      },
      {
        path: 'profesionalizacion/estudiante-semestre-materia-paralelo', component: ProEstSemMatParaleloComponent,
      },
      {
        path: 'profesionalizacion/pro-proyecto', component: ProyectoComponent,
      },{
        path: 'profesionalizacion/pro-delegados', component: ProDelegadosComponent,
      },
      {
        path: 'profesionalizacion/periodo', component: ProPeriodoComponent,
      },
      {
        path: 'profesionalizacion/pro-etapas', component: EtapasComponent,
      },
      {
        path: 'profesionalizacion/pro-periodo-semestre', component: ProPeriodoSemestreComponent,
      },
      {
        path: 'profesionalizacion/pro-materia-semestre', component: ProMateriaSemestreComponent
      },
      {
        path: 'profesionalizacion/pro-periodo-estudiante', component: ProPeriodoEstudianteComponent
      },
      {
        path: 'profesionalizacion/pro-semestre-estudiante', component: ProSemestreEstudianteComponent
      },
      {
        path: 'profesionalizacion/pro-inscripcion-delegado', component: ProInscripcionDelegadoComponent
      },
      {
        path: 'profesionalizacion/pro-paralelo-materiare', component: ProParaleloMateriaComponent,
      },
      {
        path: 'profesionalizacion/pro-estudiantes-paralelo', component: ProEstudiantesParaleloComponent,
      },
      {
        path: 'profesionalizacion/pro-paralelo-instructor', component: ProParaleloInstructorComponent,
      },
      {
        path: 'profesionalizacion/nota-materia', component: ProNotaMateriaComponent,
      },
      {
        path: 'profesionalizacion/nota-final', component: ProNotaFinalComponent,
      },
      {
        path: 'profesionalizacion/inscripcion', component: ProInscripcionComponent,
      },
      {
        path: 'profesionalizacion/pro-paralelo-materiare', component: ProParaleloMateriaComponent,
      },
      {
        path: 'profesionalizacion/pro-estudiantes-paralelo', component: ProEstudiantesParaleloComponent,
      },
      {
        path: 'profesionalizacion/pro-paralelo-instructor', component: ProParaleloInstructorComponent,
      },
      {
        path: 'profesionalizacion/pro-listado-inscripcion-delegado', component: ProListadoInscripcionDelegadoComponent,
      },
      {
        path: 'profesionalizacion/pro-flujo', component: ProFlujoComponent,
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesionalizacionRoutingModule {
}
