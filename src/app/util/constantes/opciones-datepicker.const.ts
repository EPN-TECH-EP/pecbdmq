export const OPCIONES_DATEPICKER = {
  title: 'Seleccionar Fecha',
  monthsFull: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthsShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],

  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  weekdaysNarrow: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  okBtnText: 'Ok',
  clearBtnText: 'Listo',
  cancelBtnText: 'Cancelar',
  minDate: new Date(),
  today: new Date(),
  // ayer
  previousDay: new Date(new Date().setDate(new Date().getDate() - 1)),
}
