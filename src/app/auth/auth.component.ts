import { Component, ComponentFactoryResolver, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromAuth from '../store/app.reducer';
import * as AuthAction from './store/auth.action';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnDestroy {
  isLoginMode=true;
  isLoading=false;
  errorMsg:string=null;
  @ViewChild(PlaceHolderDirective) alertHost:PlaceHolderDirective;
  private closeSubscription:Subscription;
  private storeSubscription:Subscription;


  constructor(
              // private componentFactoryResolver:ComponentFactoryResolver,
              private store:Store<fromAuth.AppState>) { }

  ngOnInit(): void {
    this.storeSubscription= this.store.select('auth').subscribe((authState)=>{
      this.isLoading=authState.loading;
      this.errorMsg=authState.authError;
      
    })
  }
  onSwitchMode(){
    this.isLoginMode=!this.isLoginMode;
  }
  onSubmit(authForm:NgForm)
  {
    if(!authForm.valid)
      return;
    const email = authForm.value.email;
    const password = authForm.value.password;
    if(this.isLoginMode)
    {
      this.store.dispatch(new AuthAction.LogInStart({email:email,password:password}))
    }
    else
    {
      this.store.dispatch(new AuthAction.SignUpStart({email:email,password:password}))
    }
    authForm.reset();
  }
  onHandleError(){
    this.store.dispatch(new AuthAction.ClearError());
  }
  ngOnDestroy(): void {
    if(this.closeSubscription)
      this.closeSubscription.unsubscribe();
    this.storeSubscription.unsubscribe();
  }
  // private showErrorAlert(message:string)
  // {
  //   const alertCmpFactory= this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  //   const hostViewContainerRef=this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();
  //   const componentRef= hostViewContainerRef.createComponent(alertCmpFactory); // component created
  //   componentRef.instance.message=message;
  //   this.closeSubscription=componentRef.instance.close.subscribe(()=>{
  //     this.closeSubscription.unsubscribe();
  //     hostViewContainerRef.clear();
  //   })
  // }
}
