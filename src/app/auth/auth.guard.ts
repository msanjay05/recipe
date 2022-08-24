import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import * as fromAppReducer from '../store/app.reducer'
import { Store } from "@ngrx/store";

@Injectable({
    providedIn:'root'
})
export class AuthGuard implements CanActivate{
    constructor(
                private router:Router,
                private store:Store<fromAppReducer.AppState>
                ){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean |UrlTree | Observable<boolean |UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
              return authState.user;
            }),
            map(user => {
              const isAuth = !!user;
              if (user) {
                return true;
              }
              return this.router.createUrlTree(['/auth']);
            })
        )

    }
}
