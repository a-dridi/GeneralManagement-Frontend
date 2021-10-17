import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


/**
 *  Save the first called uri into cache. Used to redirect to the first called uri (table name) after login. 
 */
@Injectable({
    providedIn: 'root'
})
export class RefererCache {

    readonly refererUriKey: string = "gmAppReferrer";
    readonly availableMenuPoints: string[] = ["home", "expense", "earning", "book", "crypto", "decision", "media", "organization", "savings", "wealth", "reserves"];

    constructor(private router: Router) {

    }

    /**
     * Create a menu point uri from uri and save it into the cache, if it was not saved already. If the created menu point uri does not exist, then a slash "/" (the front page) is saved .
     * @param urlValue
     */
    public addUriToCache(uriValue: string) {
        let savedUri = localStorage.getItem(this.refererUriKey);

        if (savedUri == null) {
            let parsedUri = uriValue.substring(1);
            let parsedMenuPoint = this.availableMenuPoints.filter(menuPoint => menuPoint === parsedUri);
            if (parsedMenuPoint.length > 0) {
                localStorage.setItem(this.refererUriKey, parsedUri);
                this.addCookie(this.refererUriKey, parsedUri);
            } else {
                localStorage.setItem(this.refererUriKey, "");
                this.addCookie(this.refererUriKey, "");
            }
        }
    }

    /**
     * Redirect to the last uri of menu point (the uri that the user wanted to access at first). Delete the saved uri from cache. 
     */
    public redirectToSavedUri() {
        let uriValue = localStorage.getItem(this.refererUriKey);
        let uriValue2 = this.getCookieValueByName(this.refererUriKey);

        if (uriValue != null && uriValue.trim() === "") {
            localStorage.removeItem(this.refererUriKey);
            this.router.navigate(['/' + uriValue]);
        } else {
            this.router.navigate(['/' + uriValue2]);
        }
    }

    /**
     * Fix for iOS/OS X Devices
     * @param cookieName 
     * @param cookieValue 
     */
    public addCookie(cookieName, cookieValue) {
        const dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + (5 * 60 * 1000));
        document.cookie = cookieName + "=" + cookieValue + ";expires=" + dateObj.toUTCString() + ";path=/";
    }

    /**
     * Fix for iOS/OS X Devices
     * @param cookieName 
     * @returns 
     */
    public getCookieValueByName(cookieName): string {
        let nameStr = cookieName + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookieParsed = cookieArray[i];
            while (cookieParsed.charAt(0) === ' ') {
                cookieParsed = cookieParsed.substring(1);
            }
            if (cookieParsed.indexOf(nameStr) === 0) {
                return cookieParsed.substring(nameStr.length, cookieParsed.length);
            }
        }
        return "";
    }

}