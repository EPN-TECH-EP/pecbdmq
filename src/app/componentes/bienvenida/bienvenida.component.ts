import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit, AfterViewInit {

  @ViewChild('myIframe') miIframe: ElementRef;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    const iframe: HTMLIFrameElement = this.miIframe.nativeElement;

    // Esperar un segundo antes de intentar ocultar el elemento
    setTimeout(() => {
      // Acceder al documento dentro del iframe
      const iframeDocument = iframe.contentDocument;
      console.log(iframeDocument)

      // Obtener el elemento dentro del iframe por su id y ocultarlo
      const elementoOculto = iframeDocument?.getElementById('masthead');
      if (elementoOculto) {
        elementoOculto.style.display = 'none';
      }
    }, 1000); // 1000 ms = 1 segundo

  }




}
