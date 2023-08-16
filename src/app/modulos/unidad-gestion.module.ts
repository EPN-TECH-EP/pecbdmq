import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadGestionComponent } from '../componentes/unidad-gestion/unidad-gestion.component';
import { UnidadGestionRoutingModule } from './unidad-gestion-routing.module';
import { FormsModule } from '@angular/forms';

import { MdbTableModule } from 'mdb-angular-ui-kit/table';
import { HttpClientModule } from '@angular/common/http';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CambiosPendientesGuard } from '../guard/cambios-pendientes.guard';
import {PrincipalModuleModule} from "./principal-module/principal-module.module";
import {MdbTooltipModule} from "mdb-angular-ui-kit/tooltip";
import { UtilModule } from '../componentes/util/util.module';

@NgModule({
    imports: [
        UnidadGestionRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        MdbTableModule,
        MdbFormsModule,
        PrincipalModuleModule,
        MdbTooltipModule,
        UtilModule
    ],
  declarations: [UnidadGestionComponent],
  providers: [CambiosPendientesGuard]
})
export class UnidadGestionModule { }
