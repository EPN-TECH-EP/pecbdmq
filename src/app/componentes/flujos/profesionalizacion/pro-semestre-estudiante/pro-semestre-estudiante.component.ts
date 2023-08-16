import { Component, OnInit } from '@angular/core';
import {
  defaultSemestreEstudiante, ProSemestreEstudianteCreateUpdateDto,
  ProSemestreEstudianteDto
} from "../../../../modelo/flujos/profesionalizacion/pro-semestre-estudiante.models";
import {Semestre} from "../../../../modelo/admin/semestre";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProSemestreService} from "../../../../servicios/profesionalizacion/pro-semestre.service";
import {ProSemestreEstudianteService} from "../../../../servicios/profesionalizacion/pro-semestre-estudiante.service";
import {DatoPersonalService} from "../../../../servicios/dato-personal.service";

@Component({
  selector: 'app-pro-semestre-estudiante',
  templateUrl: './pro-semestre-estudiante.component.html',
  styleUrls: ['./pro-semestre-estudiante.component.scss']
})
export class ProSemestreEstudianteComponent implements OnInit {
  selectedItem: ProSemestreEstudianteDto;
  selectListSemestres: Semestre[];
  selectedItemSemestre: number;
  selectListDatosPersonales: Object;
  listadoAsignacion: ProSemestreEstudianteDto[];
  headers: { key: string, label: string }[];
  formGroup: FormGroup;
  codigoItemEditando: number;
  estaEditandoItem: boolean;
  estaAgregandoItem: boolean;
  protected readonly defaultItem= defaultSemestreEstudiante;

  constructor(private semestreService: ProSemestreService, private datosPersonalesService: DatoPersonalService, private semestreEstudianteService: ProSemestreEstudianteService, private builder: FormBuilder) {
    this.headers =[
      {key: 'nombreSemestre', label: 'Nivel'},
      {key: 'nombreDatos', label: 'datosPersonales'},
    ]
    this.listadoAsignacion=[];
    this.selectedItem=defaultSemestreEstudiante;
    this.formGroup=new FormGroup({});
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.semestreService.listar().subscribe((response)=>{
      this.selectListSemestres=response;
    })

  }
  onCancelarEdicion(){
    this.selectedItem=defaultSemestreEstudiante;
    this.estaEditandoItem=false;
    this.codigoItemEditando=0;
    this.estaAgregandoItem=false;
    this.formGroup.reset();
  }
  onEditarRegistro(item: ProSemestreEstudianteDto){
    this.estaEditandoItem=true;
    this.selectedItem=item;
    this.codigoItemEditando= item.codSemestreEstudiante;
    this.matchDatosDelegadoEnFormulario();
  }
  onAgregarItem(){
    this.selectedItem={
      ...this.selectedItem,
      codSemestre: this.selectedItemSemestre,
    };
    this.estaAgregandoItem=true;
  }
  onGuardarCambios(){
    this.editarItem(this.selectedItem);
  }
  private construirFormulario() {
    this.formGroup=this.builder.group({
      codSemestre:['', Validators.required],
      datosPersonales: [this.selectListDatosPersonales, Validators.required]
    })

  }
  private editarItem(item: ProSemestreEstudianteDto) {
    this.selectedItem={
      ...this.selectedItem,
      codDatosPersonales:this.codDatosPersonales?.value,
    }
    const itemRequest: ProSemestreEstudianteCreateUpdateDto={
      codSemestre: this.selectedItemSemestre,
      codDatosPersonales:this.codDatosPersonales?.value,
      codSemestreEstudiante:this.selectedItem.codSemestreEstudiante
    }
    const request=itemRequest.codSemestreEstudiante==0? this.semestreEstudianteService.crear(itemRequest): this.semestreEstudianteService.actualizar(itemRequest, itemRequest.codSemestreEstudiante);
    request.subscribe({
      next:(value)=>{
        this.estaEditandoItem=false;
        this.selectedItem=defaultSemestreEstudiante;
        this.onCancelarEdicion();
        this.semestreEstudianteService.getAllBySemestre(this.selectedItemSemestre).subscribe({
          next:(result)=>{
            this.listadoAsignacion=result;
          }
        })
    }
    })
  }
  onEliminarRegistro(dato: ProSemestreEstudianteDto) {
    this.semestreEstudianteService.eliminar(dato.codSemestreEstudiante).subscribe({
      next: (instructor) => {
        this.formGroup.reset();
        this.semestreEstudianteService.getAllBySemestre(this.selectedItemSemestre).subscribe({
          next: (result) => {
            this.listadoAsignacion = result;
          }
        })
      }
    });
  }
  get codDatosPersonales() {
    return this.formGroup.get('codDatosPersonales');
  }

  private matchDatosDelegadoEnFormulario() {
    this.formGroup.patchValue({})
  }

  onSelectChange(event: any) {
    this.construirFormulario();
    this.semestreEstudianteService.getAllBySemestre(this.selectedItemSemestre).subscribe({
      next: (result) => {
        this.listadoAsignacion = result;
      }
    });
  }

}
