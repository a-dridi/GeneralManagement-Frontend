import { Injectable } from '@angular/core';


/**
 * Calendar names translations. 
 */
@Injectable({
    providedIn: 'root'
})
export class CalendarTranslations {

    public get de(): any {
        let de = {
            firstDayOfWeek: 1,
            dayNames: [ "Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag" ],
            dayNamesShort: [ "Son","Mon","Die","Mit","Don","Fre","Sam" ],
            dayNamesMin: [ "S","M","D","M","D","F","S" ],
            monthNames: [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ],
            monthNamesShort: [ "Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez" ],
            today: 'Heute',
            clear: 'Löschen'
        }
        return de;
    }


    public get es(): any {
        let es = {
            firstDayOfWeek: 1,
            dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
            monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
            today: 'Hoy',
            clear: 'Borrar'
        }
        return es;
    }

}

