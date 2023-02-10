import { MdbNotificationService, MdbNotificationRef } from 'mdb-angular-ui-kit/notification';
import { AlertaComponent } from '../componentes/util/alerta/alerta.component';
import { TipoAlerta } from '../enum/tipo-alerta';
export class Notificacion{

    static notificar(ns: MdbNotificationService, mensajeError: String, tipoAlerta: TipoAlerta) : MdbNotificationRef<AlertaComponent>{
        return ns.open(AlertaComponent, { data: { mensaje: mensajeError, clase: tipoAlerta}, autohide: true, animation: true, position: 'top-center', delay: 10000 });
    }
}