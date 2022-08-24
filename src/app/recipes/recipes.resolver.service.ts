import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { map, switchMap, take } from "rxjs/operators";
import { Recipe } from "./recipe.model";
import { of } from "rxjs";
import * as fromAppReducer from '../store/app.reducer'
import * as RecipesActions from '../recipes/store/recipes.actions'


@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private store: Store<fromAppReducer.AppState>,
        private actions$: Actions) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState => {
            return recipeState.recipes
            }),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipesActions.FetchRecipes());
                    return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
                }
                else{
                    return of(recipes);
                }
            })
        )

    }
}