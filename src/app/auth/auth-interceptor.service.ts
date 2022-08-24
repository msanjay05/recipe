import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromAuth from '../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService,
        private store: Store<fromAuth.AppState>
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),
            map(authState=>{
                return authState.user
            }),
            exhaustMap(user => {
                if (!user)
                    return next.handle(req);
                const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) })
                return next.handle(modifiedReq);
            }))

    }
}