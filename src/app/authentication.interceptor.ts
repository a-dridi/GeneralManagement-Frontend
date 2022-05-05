import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserAuthentication } from "./util/user-authentication";
import { Observable, of, throwError } from "rxjs";
import { catchError, delay, mergeMap, retry, retryWhen, take } from "rxjs/operators";
import { RefererCache } from "./util/refererCache";
import { MessageCreator } from "./util/messageCreator";

/**
 * Send authentication header in every API request. Check if user is logged in. If not redirect to login page. 
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    jwtAuthenticationToken: string;

    readonly DEFAULT_MAX_RETRIES = 1;

    //Restricted API URIs
    readonly DATABASE_URI: string = "data"
    readonly SETTINGS_URI: string = "settings"
    readonly USER_INFO_URI: string = "api/getUserEmail";
    readonly RELOADED_FIX_DONE_TAG: string = "appX19Reload";

    error504Counter: number = 0;

    constructor(private userAuthentication: UserAuthentication, private router: Router, private route: ActivatedRoute, private refererCache: RefererCache, private messageCreator: MessageCreator) {
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
            catchError((err: HttpErrorResponse) => {
                if (req.url.indexOf(this.DATABASE_URI) !== -1 || req.url.indexOf(this.SETTINGS_URI) !== -1 || req.url.indexOf(this.USER_INFO_URI) !== -1) {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 403 || err.message.includes("The Token has expired on")) {
                            this.showLoginPage();
                            console.log("User not logged in!");
                        }
                        throw new HttpErrorResponse({
                            error: err.message,
                            headers: err.headers,
                            status: err.status,
                            statusText: err.statusText,
                            url: err.url
                        });
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

    /**
 * Old (non active) Function used to fix HTTP 504 bug (gateway time out), which could occur through the backend server. Bug was solved.  
 * @param delayMs 
 * @param maxRetry 
 * @returns 
 */
    customDelayedRetry(delayMs: number, maxRetry = this.DEFAULT_MAX_RETRIES) {
        let retriesNumber = maxRetry;

        return (src: Observable<any>) =>
            src.pipe(
                retryWhen((errors: Observable<any>) => {
                    return errors.pipe(
                        mergeMap((response) => {
                            if (response.status === 504) {
                                this.error504Counter++;
                                this.show504ErrorPopup();
                                return of(response).pipe(delay(delayMs), take(retriesNumber));
                            }
                            else if (response.status === 403) {
                                this.showLoginPage();
                                console.log("User not logged in!");
                              //  this.messageCreator.showUnEscapedErrorMessage("loginLoginFailedError1");
                            }
                            else {
                                throw ({ error: response });
                            }
                        })
                    );
                })
            );
    }

    /**
     * Show error 504 popup when this error occured again after retrying it 10 times. 
     */
    show504ErrorPopup() {
        this.messageCreator.showErrorMessage("error504Message");
    }
}



