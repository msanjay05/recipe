import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromAppReducer from '../../store/app.reducer'
import * as RecipesActions from '../store/recipes.actions'
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeChangedSubscription: Subscription;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromAppReducer.AppState>
  ) { }

  ngOnInit(): void {
    this.recipeChangedSubscription = this.store
      .select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }
  newRecipe() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute })
  }
  ngOnDestroy(): void {
    this.recipeChangedSubscription.unsubscribe();
  }

}
