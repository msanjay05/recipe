import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as authActions from './auth.action'

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new authActions.AuthenticateSuccess({ email: email, userId: userId, token: token, expirationDate: expirationDate,redirect:true });
}

const handleError = (errorRes: any) => {
    let errorMsg = 'An error occured';
    if (errorRes && errorRes.error) {
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'Email already exists.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'Email not Found.';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'invalid password';
                break;
        }
    }
    return of(new authActions.AuthenticateFail(errorMsg));
}


@Injectable()
export class AuthEffects {
    @Effect()
    authLogin$ = this.actions$.pipe(
        ofType(authActions.LOGIN_START),
        switchMap((authData: authActions.LogInStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setLogOutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            )
        })
    );
    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(authActions.SIGNUP_START),
        switchMap((signUpData: authActions.SignUpStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
                {
                    email: signUpData.payload.email,
                    password: signUpData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setLogOutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                }),
                catchError(errorRes => {
                    return handleError(errorRes);
                })
            )
        })
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(authActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction:authActions.AuthenticateSuccess) => {
            if(authSuccessAction.payload.redirect)
                this.router.navigate(['/recipes'])
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(authActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' }
            }
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
            if (loadedUser.token) {
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                this.authService.setLogOutTimer(expirationDuration)
                return new authActions.AuthenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate),redirect:false });
            }
            return { type: 'DUMMY' }
        })
    )


    @Effect({ dispatch: false })
    authLogOut = this.actions$.pipe(
        ofType(authActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer()
            localStorage.removeItem('userData');
            this.router.navigate(['/auth'])
        })
    )

    constructor(private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {

    }
}