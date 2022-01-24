import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class GraphDesignSettings {


    constructor() {

    }

    getDesignSettings() {
        return {
            theme: 'lara-light-indigo',
            dark: false,
            inputStyle: 'outlined',
            ripple: true
        }
    }
}