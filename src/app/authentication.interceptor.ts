import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserAuthentication } from "./util/user-authentication";
import { Observable, of, throwError } from "rxjs";
import { catchError, delay, mergeMap, retry, retryWhen } from "rxjs/operators";
import { RefererCache } from "./util/refererCache";

/**
 * Send authentication header in every API request. Check if user is logged in. If not redirect to login page. 
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    jwtAuthenticationToken: string;

    readonly DEFAULT_MAX_RETRIES = 10;

    //Restricted API URIs
    readonly DATABASE_URI: string = "data"
    readonly SETTINGS_URI: string = "settings"
    readonly USER_INFO_URI: string = "api/getUserEmail";
    readonly RELOADED_FIX_DONE_TAG: string = "appX19Reload";

    constructor(private userAuthentication: UserAuthentication, private router: Router, private route: ActivatedRoute, private refererCache: RefererCache) {
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
            customDelayedRetry(500, 7),
            catchError((err: HttpErrorResponse) => {
                if (req.url.indexOf(this.DATABASE_URI) !== -1 || req.url.indexOf(this.SETTINGS_URI) !== -1 || req.url.indexOf(this.USER_INFO_URI) !== -1) {
                    if (err instanceof HttpErrorResponse) {

                        if (err.status === 403 || err.message.includes("The Token has expired on")) {
                            this.showLoginPage();
                            console.log("User not logged in!");
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

/**
 * Function used to fix HTTP 504 bug  (gateway time out), which could occur through the backend server.  
 * @param delayMs 
 * @param maxRetry 
 * @returns 
 */
export function customDelayedRetry(delayMs: number, maxRetry = this.DEFAULT_MAX_RETRIES) {
    let retriesNumber = maxRetry;

    return (src: Observable<any>) =>
        src.pipe(
            retryWhen((errors: Observable<any>) => errors.pipe(
                delay(delayMs),
                mergeMap(error => retriesNumber-- > 0 ? of(error) : throwError("Loading API resource failed after retrying!"))
            ))
        );
}