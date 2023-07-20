import { Paginacion } from "../../util/paginacion";
import { PostulanteValido } from "./postulante-valido";

export interface PaginacionPostulantesValidos extends Paginacion {
    content: PostulanteValido[];
}