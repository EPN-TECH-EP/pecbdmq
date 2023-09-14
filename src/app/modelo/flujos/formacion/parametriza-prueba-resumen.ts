export interface ParametrizaPruebaResumen {
    codParametrizaPruebaResumen: number;
    fechaCreacion: Date;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string;
    estado: string;
    codSubTipoPrueba: number;    
    ponderacion?: number
}
