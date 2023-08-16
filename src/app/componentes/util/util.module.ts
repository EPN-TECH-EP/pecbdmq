import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BotonVolverComponent} from './boton-volver/boton-volver.component';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {RouterModule} from '@angular/router';
import {BusquedaUsuarioComponent} from './busqueda-usuario/busqueda-usuario.component';
import {MdbValidationModule} from 'mdb-angular-ui-kit/validation';
import {MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import {MdbTabsModule} from 'mdb-angular-ui-kit/tabs';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    BotonVolverComponent,
    MenuItemComponent,
    BusquedaUsuarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MdbValidationModule,
    MdbFormsModule,
    MdbTabsModule,
    ReactiveFormsModule
  ],
  exports: [
    BotonVolverComponent,
    MenuItemComponent,
    BusquedaUsuarioComponent
  ],
})
export class UtilModule {
}
