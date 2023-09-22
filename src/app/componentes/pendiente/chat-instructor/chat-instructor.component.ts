import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-instructor',
  templateUrl: './chat-instructor.component.html',
  styleUrls: ['./chat-instructor.component.scss']
})
export class ChatInstructorComponent implements OnInit {
  mensajesEnviados: {mensaje: string}[] = [];
  mensaje: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  enviarMensaje() {
    this.mensajesEnviados.push({ mensaje: this.mensaje });
    this.mensaje = '';
  }
}
