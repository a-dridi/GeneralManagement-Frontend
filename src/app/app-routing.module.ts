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
  { path: 'home', component: FrontpageComponent, data: { animation: 'Home' } },
  { path: 'expense', component: ExpenseComponent, data: { animation: 'Expense' } },
  { path: 'earning', component: EarningComponent, data: { animation: 'Earning' }, loadChildren: () => import('./earning/earning.module').then(m => m.EarningModule) },
  { path: 'book', component: BookComponent, data: { animation: 'Book' }, loadChildren: () => import('./book/book.module').then(m => m.BookModule) },
  { path: 'crypto', component: CryptoCurrencyModuleComponent, data: { animation: 'Crypto' }, loadChildren: () => import('./crypto-currency/crypto-currency.module').then(m => m.CryptoCurrencyModule)},
  { path: 'decision', component: DecisionTableComponent, data: { animation: 'Decision' }, loadChildren: () => import('./decision/decision.module').then(m => m.DecisionModule) },
  { path: 'decision/edit/:decisionId', component: DecisionItemComponent, data: { animation: 'Decision-Edit' }, loadChildren: () => import('./decision/decision.module').then(m => m.DecisionModule)},
  { path: 'media', component: MediaTableComponent, data: { animation: 'Media' } , loadChildren: () => import('./media/media.module').then(m => m.MediaModule)},
  { path: 'organization', component: OrganizationComponent, data: { animation: 'Organization' } },
  { path: 'savings', component: SavingsTableComponent, data: { animation: 'Savings' }, loadChildren: () => import('./savings/savings.module').then(m => m.SavingsModule) },
  { path: 'wealth', component: WealthComponent, data: { animation: 'Wealth' }, loadChildren: () => import('./wealth/wealth.module').then(m => m.WealthModule) },
  { path: 'reserves', component: ReservesTableComponent, data: { animation: 'Reserves' }, loadChildren: () => import('./reserves/reserves.module').then(m => m.ReservesModule) },
  { path: "login", component: UserLoginComponent },
  { path: "user-settings", component: UserSettingsComponent, data: { animation: 'User-settings' } },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
