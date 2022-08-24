import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as shoppingListActions from '../store/shopping-list.actions';
import * as fromAppReducer from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  // @Output() ingredientAdded =  new EventEmitter<Ingredient>();
  @ViewChild('f',{static:false}) shoppingEditForm:NgForm;
  subscription:Subscription;
  editMode:boolean=false;
  editedItem:Ingredient;
  constructor(
              private store:Store<fromAppReducer.AppState>
            ) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData=>{
      if(stateData.editedIngredientIndex>-1)
      {
        this.editMode=true;
        this.editedItem=stateData.editedIngredient;
        this.shoppingEditForm.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount
        })
      }
      else{
        this.editMode=false;
      }
    })
  }
  onAddItem( form:NgForm)
  {
    const value=form.value;
    // const newIngredient= new Ingredient(this.nameInputRef.nativeElement.value,this.amountInputRef.nativeElement.value);
    const newIngredient= new Ingredient(value.name,value.amount);
    // // this.ingredientAdded.emit(newIngredient);
    if(this.editMode)
    {
      this.store.dispatch(new shoppingListActions.UpdateIngredient(newIngredient));
      form.reset();
      this.editMode=false;
    }
    else
    {
      this.store.dispatch(new shoppingListActions.AddIngredient(newIngredient));
    }
  }
  onClear()
  {
    this.shoppingEditForm.reset();
    this.editMode=false;
    this.store.dispatch(new shoppingListActions.StopEdit());
  }
  onDelete(){
    this.store.dispatch(new shoppingListActions.DeleteIngredient());
    this.onClear();
  }
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
      this.store.dispatch(new shoppingListActions.StopEdit());
  }
}
