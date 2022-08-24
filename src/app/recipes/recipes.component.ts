import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: []
})
export class RecipesComponent implements OnInit, OnDestroy {
  // selectedRecipe:Recipe;
  // private selectedRecipeSubscription:Subscription;
  // constructor(private recipesService:RecipesService) { }
  constructor(){}

  ngOnInit(): void {
    // this.selectedRecipeSubscription= this.recipesService.recipeSelected.subscribe((recipe:Recipe)=>{
    //   this.selectedRecipe=recipe;
    // });
  }
  ngOnDestroy(): void {
      // this.selectedRecipeSubscription.unsubscribe();
  }

}
