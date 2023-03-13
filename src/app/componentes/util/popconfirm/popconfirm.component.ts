import { Component, OnInit } from '@angular/core';
import { MdbPopconfirmRef } from 'mdb-angular-ui-kit/popconfirm';

@Component({
  selector: 'app-popconfirm',
  templateUrl: './popconfirm.component.html',
  styleUrls: ['./popconfirm.component.scss']
})
export class PopconfirmComponent implements OnInit {

  mensaje: string | null = null;

  constructor(public popconfirmRef: MdbPopconfirmRef<PopconfirmComponent>) {}

  ngOnInit(): void {
  }

}
