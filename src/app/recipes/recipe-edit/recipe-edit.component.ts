import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as fromAppReducer from '../../store/app.reducer'
import * as RecipesActions from '../store/recipes.actions'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  private storeSubscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromAppReducer.AppState>) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
          // console.log(this.editMode)
        }
      )
  }
  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredient = new FormArray([]);
    if (this.editMode) {
      // const recipe=this.recipesService.getRecipe(this.id);
      this.storeSubscription = this.store.select('recipes').pipe(map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.id
        })
      })).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredient.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      })

    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredient
    });
  }
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup(
        {
          'name': new FormControl(null, Validators.required),
          'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
        }
      )
    )
  }
  get ingredientControl() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  onSubmit() {
    // console.log(this.recipeForm)
    // const recipe= new Recipe(this.recipeForm.value['name'],
    //                          this.recipeForm.value['imagePath'],
    //                          this.recipeForm.value['description'],
    //                          this.recipeForm.value['ingredients']);
    if (this.editMode) {
      // this.recipesService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(new RecipesActions.UpdateRecipe({ index: this.id, newRecipe: this.recipeForm.value }))
    }
    else {
      // this.recipesService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();

  }
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute })
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(): void {
    if (this.storeSubscription)
      this.storeSubscription.unsubscribe();
  }

}
