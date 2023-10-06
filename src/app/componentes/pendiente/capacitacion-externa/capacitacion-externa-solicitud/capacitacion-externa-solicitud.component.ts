import { Component, OnInit } from '@angular/core';
import { CapacitacionExternaService } from "../capacitacion-externa.service";

@Component({
  selector: 'app-ccapacitacion-externa-solicitud',
  templateUrl: './capacitacion-externa-solicitud.component.html',
  styleUrls: ['./capacitacion-externa-solicitud.component.scss']
})
export class CapacitacionExternaSolicitudComponent implements OnInit {


  selectedTrainingType: string = '';
  trainingTypes: any[] = [
    {
      name: 'Bomberos Básicos',
      subItems: [
        'Entrenamiento para bomberos principiantes.',
        'Técnicas de extinción de incendios.',
        'Equipamiento y uso de herramientas de lucha contra incendios.'
      ]
    },
    {
      name: 'Rescate en Incendios',
      subItems: [
        'Rescate de víctimas atrapadas en incendios.',
        'Técnicas de búsqueda y rescate.',
        'Uso de herramientas de extracción.'
      ]
    },
    {
      name: 'Rescate en Altura',
      subItems: [
        'Rescate en edificios altos y estructuras elevadas.',
        'Uso de cuerdas y equipos de escalada.',
        'Rescate en espacios confinados.'
      ]
    },
    {
      name: 'Materiales Peligrosos (HAZMAT)',
      subItems: [
        'Identificación y manejo de sustancias peligrosas.',
        'Técnicas de mitigación de incidentes de materiales peligrosos.',
        'Equipamiento de protección personal.'
      ]
    },
    {
      name: 'Rescate Acuático',
      subItems: [
        'Rescate en aguas rápidas y aguas abiertas.',
        'Búsqueda y recuperación de víctimas en entornos acuáticos.',
        'Operación de embarcaciones de rescate.'
      ]
    },
    {
      name: 'Manejo de Incidentes de Múltiples Víctimas',
      subItems: [
        'Coordinación y gestión de escenarios con múltiples víctimas.',
        'Triaje y atención médica de emergencia en masa.',
        'Comunicación y logística en situaciones de crisis.'
      ]
    },
    {
      name: 'Incendios Forestales',
      subItems: [
        'Combate de incendios en áreas forestales y rurales.',
        'Técnicas de prevención y control de incendios forestales.',
        'Seguridad en el trabajo en entornos de incendios forestales.'
      ]
    },
    {
      name: 'Entrenamiento Médico de Emergencia',
      subItems: [
        'Capacitación en primeros auxilios y RCP.',
        'Soporte vital básico y avanzado.',
        'Cuidado médico de emergencia en el lugar de la escena.'
      ]
    },
    {
      name: 'Liderazgo y Gestión de Incidentes',
      subItems: [
        'Desarrollo de habilidades de liderazgo en situaciones de emergencia.',
        'Planificación y gestión de incidentes.',
        'Coordinación de equipos de respuesta.'
      ]
    },
    {
      name: 'Educación Comunitaria',
      subItems: [
        'Programas de educación pública sobre seguridad contra incendios.',
        'Visitas a escuelas y eventos comunitarios.',
        'Promoción de la seguridad en el hogar y en la comunidad.'
      ]
    }
  ];

  selectedSubItems: {type: string, subItems: string[]}[] = []; // Array de objetos para almacenar tipo y subítems

  esSolictudEnviada: boolean = false;

  constructor(private capacitacionExternaService: CapacitacionExternaService) { }

  ngOnInit(): void {
  }

  getSubItems(trainingType: string): string[] {
    const selectedType = this.trainingTypes.find(type => type.name === trainingType);
    return selectedType ? selectedType.subItems : [];
  }

  toggleSubItem(subItem: string): void {
    const index = this.selectedSubItems.findIndex(item => item.type === this.selectedTrainingType);

    if (index === -1) {
      // Si el tipo de capacitación no está en la lista, agregarlo con el subítem
      this.selectedSubItems.push({ type: this.selectedTrainingType, subItems: [subItem] });
    } else {
      // Si el tipo de capacitación ya está en la lista, agregar o eliminar el subítem
      const subItemIndex = this.selectedSubItems[index].subItems.indexOf(subItem);
      if (subItemIndex === -1) {
        this.selectedSubItems[index].subItems.push(subItem);
      } else {
        this.selectedSubItems[index].subItems.splice(subItemIndex, 1);
      }
    }

    console.log(this.selectedSubItems);

  }

  submitRequest(){

    this.capacitacionExternaService.items = this.selectedSubItems;
    this.esSolictudEnviada = true;
    this.capacitacionExternaService.exponerItemsSolicitud();
    this.capacitacionExternaService.guardarEnLocalStorage();
  }

  solicitarOtro(){
    this.esSolictudEnviada = false;
  }
}
