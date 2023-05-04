import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalDataService {
  saveData(nombre: string, data: any) {
    const obfuscatedData = btoa(JSON.stringify(data));
    localStorage.setItem(nombre, obfuscatedData);
  }

  getData(nombre: string): any {
    const obfuscatedData = localStorage.getItem(nombre);
    if (obfuscatedData !== undefined && obfuscatedData !== null) {
      const data = JSON.parse(atob(obfuscatedData));
      return data;
    } else {
      return null;
    }
  }
}
