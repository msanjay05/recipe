import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuthReducer from './store/app.reducer';
import * as AuthActions from './auth/store/auth.action'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // loadedFeature:string='recipe'
  // onNavigate(feature:string)
  // {
  //   this.loadedFeature=feature;
  // }
  constructor(private store: Store<fromAuthReducer.AppState>){}
  ngOnInit(): void {
      this.store.dispatch(new AuthActions.AutoLogIn())
  }
}
