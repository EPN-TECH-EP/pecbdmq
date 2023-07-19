export interface ResultadosPruebasDatos {
    /*
private Integer codPostulante;
	private String idPostulante;
	private String cedula;
	private String nombre;
	private String apellido;
	private String correoPersonal;

	private Integer resultado;
	private String resultadoTiempo;
	private Boolean cumplePrueba;
	private BigDecimal notaPromedioFinal;
    */

    codPostulante: number;
    idPostulante: string;
    cedula: string;
    nombre: string;
    apellido: string;
    correoPersonal: string;
    resultado: number;
    resultadoTiempo: string;
    cumplePrueba: boolean;
    notaPromedioFinal: number;
}