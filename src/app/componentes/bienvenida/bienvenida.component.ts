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

  }




}
