import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { ComponentFactoryResolver, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserAuthentication } from "./util/user-authentication";
import { Observable, throwError } from "rxjs";
import { tap, catchError, retry } from "rxjs/operators";

/**
 * Send authentication header in every API request. Check if user is logged in. If not redirect to login page. 
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    jwtAuthenticationToken: string;

    constructor(private userAuthentication: UserAuthentication, private router: Router) {
    }

    /**
     * Intercept only database API (part of /api/data)
     * @param req 
     * @param next 
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.jwtAuthenticationToken = this.userAuthentication.getUserAuthenticationJwtToken();

        console.log("intercept auth token: ");
        console.log(this.jwtAuthenticationToken);

        if (req.url.indexOf("/api/data/") !== -1) {
            console.log("OK.  API request");

            if (this.jwtAuthenticationToken === null) {
                console.log("auth null");
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
                console.log("catch error");
                console.log(err);
                if (req.url.indexOf("/api/data/") !== -1) {
                    console.log("TOKEN: ");
                    console.log(this.jwtAuthenticationToken);

                    if (err instanceof HttpErrorResponse) {
                        
                        if (err.status === 403 || err.message.includes("The Token has expired on")) {
                            this.showLoginPage();
                            console.log("401 error");
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