/**

{
    "content": [
        {
            "codPostulante": 97,
            "idPostulante": null,
            "cedula": "1715150785",
            "correoPersonal": "aherrera103@tech.epn.edu.ec",
            "nombre": "ALEX8",
            "apellido": "SOLIS"
        },
        {
            "codPostulante": 271,
            "idPostulante": "F000063",
            "cedula": "1001094612",
            "correoPersonal": "marianita.estrella@outlook.com",
            "nombre": "SOLIMAR DE",
            "apellido": "LOPEZ PERUGACHI"
        },
        {
            "codPostulante": 78,
            "idPostulante": null,
            "cedula": "1713999604",
            "correoPersonal": "ahbrito2023@gmail.com",
            "nombre": "LAURA3",
            "apellido": "VERA"
        },
        {
            "codPostulante": 272,
            "idPostulante": "F000064",
            "cedula": "1712207321",
            "correoPersonal": "solimo4076@dronetz.com",
            "nombre": "MARIA NELLY",
            "apellido": "MORENO PERALTA"
        },
        {
            "codPostulante": 246,
            "idPostulante": "F000049",
            "cedula": "1717395378",
            "correoPersonal": "ahbrito20013@gmail.com",
            "nombre": "LORENA JACQUELINE",
            "apellido": "MAIGUA CAJAS"
        },
        {
            "codPostulante": 248,
            "idPostulante": "F000050",
            "cedula": "1001446671",
            "correoPersonal": "ahbrito20121@gmail.com",
            "nombre": "SONIA MARLENE",
            "apellido": "LOZANO TORRES"
        },
        {
            "codPostulante": 56,
            "idPostulante": "F000027",
            "cedula": "1709369548",
            "correoPersonal": "",
            "nombre": "FAUSTO",
            "apellido": "VILLA"
        },
        {
            "codPostulante": 47,
            "idPostulante": "F000019",
            "cedula": "1715187058",
            "correoPersonal": "",
            "nombre": "SILVIA",
            "apellido": "CANDO"
        },
        {
            "codPostulante": 74,
            "idPostulante": null,
            "cedula": "1715150775",
            "correoPersonal": "aherrera5@tech.epn.edu.ec",
            "nombre": "ALEX5",
            "apellido": "SOLIS"
        }
    ],
    "pageable": {
        "sort": {
            "empty": true,
            "sorted": false,
            "unsorted": true
        },
        "offset": 10,
        "pageNumber": 1,
        "pageSize": 10,
        "unpaged": false,
        "paged": true
    },
    "last": true,
    "totalElements": 19,
    "totalPages": 2,
    "size": 10,
    "number": 1,
    "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
    },
    "first": false,
    "numberOfElements": 9,
    "empty": false
}

 */


export interface Paginacion {
    content: any[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

