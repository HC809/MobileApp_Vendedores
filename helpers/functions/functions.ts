import moment from 'moment';
import 'moment/locale/es';

//Formato Moneda
export const formatNumber = (number: number) => '' + number.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

//Obtener Fecha Actual
export const currentDate = (fecha: Date) => {
    fecha.setTime(fecha.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    return fecha;
}

//Formato fecha normal
export const dateNormalFormat = (fecha: Date) => {
    let initDate = moment(fecha);
    initDate.locale('es');

    return `${initDate.format('L')}`;
}

//Formato fecha normal
export const hourFormat = (fecha: Date) => {
    let initDate = moment(fecha);

    return `${initDate.format('h:mm:ss a')}`;
}

//UTC fecha
export const getUtcDate = (fecha: Date) => {
    return new Date(new Date(fecha).setTime((new Date(fecha).getTime() - new Date().getTimezoneOffset() * 60 * 1000)));
}

//Formato fecha 
export const dateFormat = (fecha: Date) => {
    let initDate = moment(fecha);
    initDate.locale('es');

    return `${initDate.format('ll')}`;
}

//Formato fecha inicio y fecha final promociones
export const dateFormatPromocion = (fechaInicio: Date, fechaFinal: Date) => {
    let initDate = moment(fechaInicio);
    initDate.locale('es');
    let lastDate = moment(fechaFinal);
    lastDate.locale('es');

    return `${initDate.format('ll')}  -  ${lastDate.format('ll')}`;
}

//Obetener minutos de diferencia entre la fecha de facturacion y la fecha actual
export const diffMinutes = (fechaFac: Date) => {
    let today = moment(currentDate(new Date()));
    let diffMs = moment.duration(today.diff(fechaFac));

    return ToNumber(diffMs.asMinutes());
}

//Obetener dias de diferencia entre la fecha de vencimiento y la fecha actual
export const diffDias = (fechaVencimiento: Date) => {
    let today = moment(currentDate(new Date()));
    let diffMs = moment.duration(today.diff(fechaVencimiento));

    return ToNumber(diffMs.asDays());
}

//Formato numero con dos decimales
export function ToNumber(number: number) {
    return Number(number.toFixed(2))
}

export function formatLeadingZeros(number: number, many: number) {
    return ('0'.repeat(many) + number).slice(-many)
}
