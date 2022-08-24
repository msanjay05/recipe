import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as fromAppReducer from '../../store/app.reducer'
import * as RecipesActions from '../store/recipes.actions'
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'



@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  // @Input()recipe:Recipe;
  recipe: Recipe;
  id: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(map(params => {
      return +params['id'];
    }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        })
      })
    ).subscribe(recipe => {
      this.recipe = recipe
    })
  }
  onAddToShoppinglist() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }
  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes'])
  }
}
