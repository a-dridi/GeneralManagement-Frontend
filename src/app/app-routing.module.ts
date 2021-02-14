import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { UserLoginComponent } from './user/user-login/user-login.component';


const routes: Routes = [
  { path: 'expense', component: ExpenseComponent },
  { path: "login", component: UserLoginComponent },
  { path: '', redirectTo: 'expense', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
