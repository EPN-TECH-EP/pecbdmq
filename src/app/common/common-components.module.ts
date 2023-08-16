import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MdbSelectModule} from 'mdb-angular-ui-kit/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AssignDataComponent} from './assign-data/assign-data.component';
import {ApiServiceFactoryImpl} from './assign-data/interface/ApiServiceFactoryImpl';
import { GenericSearchComponent } from './generic-search/generic-search.component';
import {MdbTabsModule} from "mdb-angular-ui-kit/tabs";
import {MdbValidationModule} from "mdb-angular-ui-kit/validation";


@NgModule({
  declarations: [
    AssignDataComponent,
    GenericSearchComponent,
  ],
  exports: [
    AssignDataComponent,
    GenericSearchComponent
  ],
  providers: [
    ApiServiceFactoryImpl
  ],
    imports: [
        CommonModule,
        MdbSelectModule,
        FormsModule,
        MdbTabsModule,
        MdbValidationModule,
        ReactiveFormsModule
    ]
})
export class CommonComponentsModule { }
