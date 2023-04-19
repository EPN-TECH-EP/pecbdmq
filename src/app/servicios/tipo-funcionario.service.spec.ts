// import { async, inject, TestBed } from '@angular/core/testing';
// import { TipoFuncionarioService } from './tipo-funcionario.service';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
// import { map } from 'rxjs/operators';


// describe('TipoFuncionarioService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClient],
//       providers: [TipoFuncionarioService]
//     });
//   });

//   it('should be created', inject([TipoFuncionarioService], (service: TipoFuncionarioService) => {
//     expect(service).toBeTruthy();
//   }));

//   it ('debería  mostrar funcionarios', async(() => {
//     const service: TipoFuncionarioService = TestBed.get(TipoFuncionarioService);
//     service.getTipoFuncionario().subscribe(
//       (response) => expect(((res: Response) => res.json())).not.toBeNull(),
//       (error) => fail(error)
//     );
//   }));
// });
