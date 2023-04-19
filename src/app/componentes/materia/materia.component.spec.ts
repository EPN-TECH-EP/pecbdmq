import { MateriasTbl } from './../../modelo/util/materias-tbl';
import { Materia } from './../../modelo/materias';
import { MateriaComponent } from 'src/app/componentes/materia/materia.component';
import { MateriaService } from '../../servicios/materia.service';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { ComponentFixture, TestBed, waitForAsync, inject,  async } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';
import { FormsModule, FormControl, Validators, ReactiveFormsModule,  } from '@angular/forms';
import { MdbTableModule } from 'code/mdb-angular-ui-kit/table';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import {of} from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';


// Other imports
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';


describe('MateriaService', () => {
 let materiaService: MateriaService
 let fixture: ComponentFixture<MateriaComponent>;
 let httpClientSpy: jasmine.SpyObj<HttpClient>;
 let httpClient: HttpClient;
 let httpTestingController: HttpTestingController;
 let component: MateriaComponent

  beforeEach(async() => {
    TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      BrowserModule,
      ReactiveFormsModule,
      FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  .compileComponents();

  fixture = TestBed.createComponent(MateriaComponent);
  component = fixture.componentInstance;
  httpClient = TestBed.inject(HttpClient);
  httpTestingController = TestBed.inject(HttpTestingController);
  fixture.detectChanges();

});







})
