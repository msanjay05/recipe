import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as fromAppReducer from '../store/app.reducer'
import * as ShoppingListActions from './store/shopping-list.actions'


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients:Ingredient[];
  ingredients:Observable<{ingredients:Ingredient[]}>;
  private ingredientsChangedSubscription:Subscription;

  constructor(
              private store:Store<fromAppReducer.AppState>
              ) { }

  ngOnInit(): void {
    this.ingredients=this.store.select('shoppingList')
  }

  
  onEditItem(index:number)
  {
    this.store.dispatch(new  ShoppingListActions.StartEdit(index));
  }
  ngOnDestroy(): void {
    // this.ingredientsChangedSubscription.unsubscribe()
  }
}
