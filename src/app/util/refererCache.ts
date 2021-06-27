import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


/**
 *  Save the first called uri into cache. Used to redirect to the first called uri (table name) after login. 
 */
@Injectable({
    providedIn: 'root'
})
export class RefererCache {

    readonly refererUriKey: string = "";
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
            if (this.availableMenuPoints.find(menuPoint => menuPoint === parsedUri)) {
                localStorage.setItem(this.refererUriKey, parsedUri);
            } else {
                localStorage.setItem(this.refererUriKey, "");
            }
        }
    }

    /**
     * Redirect to the last uri of menu point (the uri that the user wanted to access at first). Delete the saved uri from cache. 
     */
    public redirectToSavedUri() {
        let uriValue = localStorage.getItem(this.refererUriKey);
        if (uriValue != null) {
            localStorage.removeItem(this.refererUriKey);
            this.router.navigate(['/' + uriValue]);
        }
    }

}