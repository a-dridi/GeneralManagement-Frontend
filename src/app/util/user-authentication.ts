import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserAuthentication {

    readonly USERID_SESSION_STORAGE_ID: string = "X420Px25";
    readonly JWTTOKEN_SESSION_STORAGE_ID: string = "F210P345325";
    public jwttoken_app_variable:string = "";

    constructor() {

    }

    public saveUserAuthentication(userId, jwtToken) {
        sessionStorage.removeItem(this.USERID_SESSION_STORAGE_ID);
        sessionStorage.removeItem(this.JWTTOKEN_SESSION_STORAGE_ID);
        this.jwttoken_app_variable=jwtToken;
        sessionStorage.setItem(this.USERID_SESSION_STORAGE_ID, "" + userId);
        sessionStorage.setItem(this.JWTTOKEN_SESSION_STORAGE_ID, jwtToken);
    }

    /**
     * Get User id from session storage. Returs 0 if user id is not saved in session storage of user. Can happen if session is closed.
     */
    public getUserAuthenticationUserId(): number {
        let userIdString = sessionStorage.getItem(this.USERID_SESSION_STORAGE_ID);
        if (userIdString !== null) {
            return parseInt(userIdString);
        }
        return 0;
    }

    /**
    * Get JWT authentication token from session storage. Returs null if jwt authentication token is not saved in session storage of user. Can happen if session is closed.
    */
    public getUserAuthenticationJwtToken(): string {
        if(this.jwttoken_app_variable !==""){
            return this.jwttoken_app_variable;
        }
        return sessionStorage.getItem(this.JWTTOKEN_SESSION_STORAGE_ID);
    }
}