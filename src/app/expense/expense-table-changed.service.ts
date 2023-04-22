import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTableChangedService {

  private notificationSource = new BehaviorSubject("Listening for changes in Expense table...");
  currentNotification = this.notificationSource.asObservable();

  constructor() { }

  expenseTableReloaded(notificationMessage: string) {
    this.notificationSource.next(notificationMessage);
  }

}
