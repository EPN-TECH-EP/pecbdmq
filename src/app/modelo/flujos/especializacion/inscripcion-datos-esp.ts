/*
*
* public class InscripcionDatosEspecializacion {

	private Long codInscripcion;
	private String cedula;
	private String nombre;
	private String apellido;
	private String nombreCatalogoCurso;

}
* */

export interface InscripcionDatosEspecializacion {
    codInscripcion: number;
    cedula: string;
    nombre: string;
    apellido: string;
    nombreCatalogoCurso: string;
    correoPersonal ?: string;
    codigoUnicoEstudiante ?: string;
}
