// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://192.168.0.184:8081', // pruebas CBDMQ
  // apiUrl: 'http://192.168.0.184:8083', // interno
  apiUrl: 'http://localhost:8083', // local
  // apiUrl: 'http://192.168.0.184:8080/api-pecb-3', // proxy

  // seguridades, gestión de timeout y reintentos
  APP_KEY: 'vQ9sdpG52a3Rm4LZYc8fDlNKjnWbHIXheU6YiAzS1VJ0o7OtTwgxqpukCFREz',
  NUMERO_REINTENTOS : 3,
  DELAY_REINTENTOS : 2000, // 2 segundos
  DURACION_TIMEOUT : 30000, // 30 segundos

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
