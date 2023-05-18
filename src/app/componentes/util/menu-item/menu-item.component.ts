import { Component, Input, OnInit } from '@angular/core';
import { Menu } from 'src/app/modelo/admin/menu';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() menu: Menu;

  constructor() { }

  ngOnInit(): void {
    //console.log(this.menu);
  }

}
