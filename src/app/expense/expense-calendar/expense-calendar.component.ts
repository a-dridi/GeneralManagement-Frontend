import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ExpenseCalendarService } from '../expensecalendar.services';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ExpenseCalendar } from 'src/app/expense/model/expense-calendar.model';
import { FullCalendar } from 'primeng/fullcalendar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-expense-calendar',
  templateUrl: './expense-calendar.component.html',
  styleUrls: ['./expense-calendar.component.scss']
})
export class ExpenseCalendarComponent implements OnInit {

  expenseCalenderItems: any[] = [];
  expenseCalenderOptions: any = {};
  currentDate: Date = new Date();
  explanationTabHeader: string = "";

  @ViewChild('expensesCalendar') private expensesCalendar: FullCalendar;

  constructor(private messageCreator: MessageCreator, private expenseCalendarService: ExpenseCalendarService, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.expenseCalenderOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: this.currentDate,
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      editable: true
    };

    this.loadExpenseCalendarData();
    this.translateService.get(['expensecalendar.explanationPanelTitle']).subscribe(translations => {
      this.explanationTabHeader = translations['expensecalendar.explanationPanelTitle'];
    });
  }

  loadExpenseCalendarData() {
    this.expenseCalendarService.getAllExpenseCalendarData().subscribe((expenseCalendarData: ExpenseCalendar[]) => {
      this.expenseCalenderItems = expenseCalendarData;
      console.log("loadExpenseCalendarData !!!!");
      console.log(expenseCalendarData);
    }, err => {
      console.log(err);
      this.messageCreator.showErrorMessage("expenseCalendarError1");
    })
  }

}
