import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { ComponentFactoryResolver, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserAuthentication } from "./util/user-authentication";
import { Observable, throwError } from "rxjs";
import { tap, catchError, retry } from "rxjs/operators";
import { RefererCache } from "./util/refererCache";

/**
 * Send authentication header in every API request. Check if user is logged in. If not redirect to login page. 
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    jwtAuthenticationToken: string;

    //Restricted API URIs
    readonly DATABASE_URI: string = "data"
    readonly SETTINGS_URI: string = "settings"
    readonly USER_INFO_URI: string = "api/getUserEmail";

    constructor(private userAuthentication: UserAuthentication, private router: Router, private refererCache: RefererCache) {
    }

    /**
     * Intercept only database API (part of /api/data)
     * @param req 
     * @param next 
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.jwtAuthenticationToken = this.userAuthentication.getUserAuthenticationJwtToken();
        if (req.url.indexOf(this.DATABASE_URI) !== -1 || req.url.indexOf(this.SETTINGS_URI) !== -1 || req.url.indexOf(this.USER_INFO_URI) !== -1) {
            if (this.jwtAuthenticationToken === null) {
                this.showLoginPage();
            }

            req = req.clone({
                setHeaders: {
                    Authorization: `${this.jwtAuthenticationToken}`
                }
            });
        }
        return next.handle(req).pipe(
            retry(0),
            catchError((err: HttpErrorResponse) => {
                if (req.url.indexOf(this.DATABASE_URI) !== -1 || req.url.indexOf(this.SETTINGS_URI) !== -1 || req.url.indexOf(this.USER_INFO_URI) !== -1) {
                    if (err instanceof HttpErrorResponse) {

                        if (err.status === 403 || err.message.includes("The Token has expired on")) {
                            this.showLoginPage();
                            console.log("User not logged in!");
                        }
                        //Gateway time out error fix
                        else if (err.status === 504) {
                            location.reload();
                        }
                    }
                }
                return throwError(err);
            })) as Observable<HttpEvent<any>>;
    }

    /**
     * User must authenticate. Session is over. 
     */
    showLoginPage() {
        this.router.navigate(['/login']);
    }

}