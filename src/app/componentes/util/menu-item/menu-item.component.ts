import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/modelo/admin/menu-item';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() item!: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }

}
