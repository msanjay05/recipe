import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface ShoppingListState{
    ingredients:Ingredient[];
    editedIngredient:Ingredient;
    editedIngredientIndex:number;
}


const initialState:ShoppingListState = {
    ingredients:[new Ingredient('Test 1',10),new Ingredient('Test 2',10)],
    editedIngredient:null,
    editedIngredientIndex:-1

}

export function shoppinglistReducer(state:ShoppingListState=initialState,action:ShoppingListActions.ShoppingListActions){   
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            return{
                ...state,
                ingredients:[...state.ingredients,action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return{
                ...state,
                ingredients:[...state.ingredients,...action.payload]
            }
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient=state.ingredients[state.editedIngredientIndex];
            const updateIngredient={
                ...ingredient,
                ...action.payload
            }
            const updatedIngredients=[...state.ingredients]
            updatedIngredients[state.editedIngredientIndex]=updateIngredient;
            return{
                ...state,
                ingredients:updatedIngredients,
                editedIngredientIndex:-1,
                editedIngredient:null
            }
        case ShoppingListActions.START_EDIT:
            return{
                ...state,
                editedIngredientIndex:action.payload,
                editedIngredient:{...state.ingredients[action.payload]}
            }
        case ShoppingListActions.STOP_EDIT:
            return{
                ...state,
                editedIngredient:null,
                editedIngredientIndex:-1
            }
        case ShoppingListActions.DELETE_INGREDIENT:
            return{
                ...state,
                ingredients:state.ingredients.filter((ig,igIndex)=>{
                    return igIndex!==state.editedIngredientIndex;
                    }),
                editedIngredientIndex:-1,
                editedIngredient:null
            }
        default:
            return state;
    }

}