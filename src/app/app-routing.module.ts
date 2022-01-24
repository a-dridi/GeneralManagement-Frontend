import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './book/book/book.component';
import { CryptoCurrencyModuleComponent } from './crypto-currency/crypto-currency-module.component';
import { DecisionItemComponent } from './decision/decision-item/decision-item.component';
import { DecisionTableComponent } from './decision/decision-table/decision-table.component';
import { EarningComponent } from './earning/earning.component';
import { ExpenseComponent } from './expense/expense.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { MediaTableComponent } from './media/media-table/media-table.component';
import { OrganizationComponent } from './organization/organization.component';
import { ReservesTableComponent } from './reserves/reserves-table/reserves-table.component';
import { SavingsTableComponent } from './savings/savings-table/savings-table.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { WealthComponent } from './wealth/wealth.component';


const routes: Routes = [
  // Adjust also the variable availableMenuPoints in util class "RefererCache"!
  { path: 'home', component: FrontpageComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'earning', component: EarningComponent },
  { path: 'book', component: BookComponent },
  { path: 'crypto', component: CryptoCurrencyModuleComponent },
  { path: 'decision', component: DecisionTableComponent },
  { path: 'decision/edit/:decisionId', component: DecisionItemComponent },
  { path: 'media', component: MediaTableComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'savings', component: SavingsTableComponent },
  { path: 'wealth', component: WealthComponent },
  { path: 'reserves', component: ReservesTableComponent },
  { path: "login", component: UserLoginComponent },
  { path: "user-settings", component: UserSettingsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
