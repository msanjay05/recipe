import { Injectable, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

@Injectable()

export class ShoppinglistService{
    // ingredientsChanged=new EventEmitter<Ingredient[]>();
    ingredientsChanged=new Subject<Ingredient[]>();
    startedEditing=new Subject<number>();
    private ingredients:Ingredient[]=[
        new Ingredient('Test 1',10),
        new Ingredient('Test 2',10)
    ]
    getIngredient()
    {
        return this.ingredients.slice();
    }
    getIngredientFromIndex(index:number)
    {
        return this.ingredients[index];
    }
    addIngredient(ingredient:Ingredient)
    {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredientsFromRecipe(ingredient:Ingredient[])
    {
        this.ingredients.push(...ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    updateIngredient(index:number,ingredient:Ingredient)
    {
        this.ingredients[index]=ingredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }
    deleteIngredient(index:number)
    {
        this.ingredients.splice(index,1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}