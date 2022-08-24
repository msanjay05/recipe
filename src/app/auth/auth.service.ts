import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromAppReducer from '../store/app.reducer'
import * as AuthActions from './store/auth.action'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenExpirationTimer:any;
    constructor(private store:Store<fromAppReducer.AppState>) { }

    
    setLogOutTimer(expirationDuration:number)
    {
        this.tokenExpirationTimer= setTimeout(()=>{
            this.store.dispatch(new AuthActions.LogOut);
        },expirationDuration);
    }
    clearLogoutTimer()
    {
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer=null;
        }
    }
}
