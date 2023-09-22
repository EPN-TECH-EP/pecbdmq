import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eps-instructor-chat',
  templateUrl: './eps-instructor-chat.component.html',
  styleUrls: ['./eps-instructor-chat.component.scss']
})
export class EpsInstructorChatComponent implements OnInit {

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
