export class CatalogoCurso{
    codCatalogoCursos:          number;
    nombreCatalogoCurso:        string;
    descripcionCatalogoCurso:   string;
    codTipoCurso:               number;
    estado:                     string;

    constructor() {
        this.codCatalogoCursos = null;
        this.nombreCatalogoCurso = '';
        this.descripcionCatalogoCurso = '';
        this.codTipoCurso = null;
        this.estado = '';
    }
}
