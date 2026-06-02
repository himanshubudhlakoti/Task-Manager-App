import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { getItemFromLocal } from "src/app/libs/functions";
import { Router } from '@angular/router';
import { UserRoles } from "src/app/libs/constants/enums";
import { routesList } from "src/app/libs/constants";
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';

@Injectable()
export class OutbondInterceptor implements HttpInterceptor {
    private token: string | null = "";
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.token = getItemFromLocal("token");
        if (this.token) {
            let req_with_token = request.clone({
                withCredentials: true,
                setHeaders: {

                    Authorization: `Bearer ${this.token}`,
                    ROLE: getItemFromLocal("role") || ""
                }
            });
            return next.handle(req_with_token)
        }
        else {
            return next.handle(request);
        }
    }
}


@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;

    private refreshTokenSubject =
        new BehaviorSubject<string | null>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(

            catchError((error: HttpErrorResponse) => {

                const isRefreshRequest =
                    req.url.includes('auths/verify-refresh-token');

                if (
                    (error.status === 401 || error.status === 403) &&
                    !isRefreshRequest
                ) {
                    return this.handle401Error(req, next);
                }

                return throwError(() => error);
            })
        );
    }

    private handle401Error(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        if (!this.isRefreshing) {

            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.http.post(
                `${environment.serverUrl}auths/verify-refresh-token`,
                {},
                {
                    withCredentials: true
                }
            ).pipe(

                switchMap((response: any) => {

                    this.isRefreshing = false;

                    const accessToken =
                        response?.data?.accessToken;

                    const role =
                        response?.data?.accessToken;

                    if (!accessToken) {
                        throw new Error('Access token not received');
                    }

                    localStorage.setItem(
                        'token',
                        accessToken
                    );
                    localStorage.setItem(
                        'role',
                        role
                    );

                    this.refreshTokenSubject.next(
                        accessToken
                    );

                    const retryReq =
                        this.addTokenToRequest(
                            req,
                            accessToken
                        );

                    return next.handle(retryReq);
                }),

                catchError((refreshError) => {

                    this.isRefreshing = false;

                    localStorage.clear();

                    this.router.navigate([routesList.LOGIN.path]);

                    return throwError(() => refreshError);
                })
            );
        }

        return this.refreshTokenSubject.pipe(

            filter((token) => token !== null),

            take(1),

            switchMap((token) => {

                const retryReq =
                    this.addTokenToRequest(
                        req,
                        token as string
                    );

                return next.handle(retryReq);
            })
        );
    }

    private addTokenToRequest(
        request: HttpRequest<any>,
        token: string
    ): HttpRequest<any> {

        return request.clone({
            withCredentials: true,
            setHeaders: {
                Authorization: `Bearer ${token}`,
                ROLE: getItemFromLocal('role') || ''
            }
        });
    }
}













