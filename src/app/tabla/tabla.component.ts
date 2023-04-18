import { Component } from '@angular/core';
import { ViewChild } from'@angular/core';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';


export interface Person {
  company: string,
  office: string,
  employees: number,
  international: string,
}


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaComponent  {
  @ViewChild('table') table!: MdbTableDirective<Person>;

  editElementIndex = -1;

  addRow = false;

  company = '';
  office = 'Warsaw';
  employees = 1;
  international = '';


  options = [
    { value: 'London', label: 'London' },
    { value: 'Warsaw', label: 'Warsaw' },
    { value: 'New York', label: 'New York' },
  ];

  headers = ['Company', 'Office', 'Employees', 'International'];

  dataSource: Person[] = [
    {
      company: 'Smith & Johnson',
      office: 'London',
      employees: 30,
      international: '',
    },
    {
      company: 'P.J. Company',
      office: 'London',
      employees: 80,
      international: '',
    },
    {
      company: 'Food & Wine',
      office: 'London',
      employees: 12,
      international: '',
    },

    {
      company: 'Smith & Johnson',
      office: 'London',
      employees: 30,
      international: '',
    },


  ];
  constructor() { }
  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  addNewRow() {
    const newRow: Person = {
      company: this.company,
      office: this.office,
      employees: this.employees,
      international: this.international
    }
    this.dataSource = [...this.dataSource, {...newRow}];

    this.company = '';
    this.office = 'Warsaw';
    this.employees = 1;
    this.international = '';
    this.addRow = false;
  }

  onDeleteClick(data: Person) {
    const index = this.dataSource.indexOf(data);
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource]
  }
  ngOnInit(): void {
  }
}
