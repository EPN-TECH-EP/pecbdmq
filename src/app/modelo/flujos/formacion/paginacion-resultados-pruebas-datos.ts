import { Paginacion } from '../../util/paginacion';
import { ResultadosPruebasDatos } from './resultados-pruebas-datos';
export interface PaginacionResultadosPruebasDatos extends Paginacion {
    content: ResultadosPruebasDatos[];
}