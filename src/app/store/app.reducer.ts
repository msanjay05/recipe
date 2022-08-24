import {  ActionReducerMap } from '@ngrx/store'
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import * as fromRecipes from '../recipes/store/recipes.reducer'


export interface AppState{
    shoppingList:fromShoppingList.ShoppingListState;
    auth:fromAuth.AuthState;
    recipes:fromRecipes.RecipeState;
}

export const appReduder:ActionReducerMap<AppState>={
    shoppingList:fromShoppingList.shoppinglistReducer,
    auth:fromAuth.authReducer,
    recipes:fromRecipes.recipesReducer
}