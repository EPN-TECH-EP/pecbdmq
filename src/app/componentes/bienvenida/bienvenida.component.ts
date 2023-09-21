import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit {

  @ViewChild('mi-iframe') miIframe: ElementRef;
  constructor() { }

  ngOnInit(): void {

    const iframe: HTMLIFrameElement = this.miIframe.nativeElement;

    // Añade un event listener para esperar a que se cargue el iframe
    iframe.onload = () => {
      // Accede al documento del iframe
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

      // Oculta un elemento específico dentro del iframe (por su ID o clase)
      const elementoOcultar = iframeDocument.getElementById('masthead');

      console.log(elementoOcultar);
      if (elementoOcultar) {
        elementoOcultar.style.display = 'none';
      }
    };

  }

}
