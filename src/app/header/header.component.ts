import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";
import * as fromAppReducer from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.action'
import * as RecipesActions from '../recipes/store/recipes.actions'


@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    // @Output() featureSelectd= new EventEmitter<string>();
    // onSelect(event:string)
    // {
    //     this.featureSelectd.emit(event);
    // }
    isAuthenticated = false;
    private userSubscription: Subscription;
    constructor(
        private store: Store<fromAppReducer.AppState>) { }
    ngOnInit(): void {
        this.userSubscription = this.store.select('auth')
            .pipe(map(authState => authState.user))
            .subscribe(user => {
                this.isAuthenticated = !!user;
                console.log(!user);
                console.log(!!user);
            });

    }
    onSaveData() {
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipesActions.StoreRecipes())
    }
    onFetchData() {
        // this.dataStorageService.getRecipes().subscribe();
        this.store.dispatch(new RecipesActions.FetchRecipes())
    }
    onLogout() {
        this.store.dispatch(new AuthActions.LogOut());
    }
    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}