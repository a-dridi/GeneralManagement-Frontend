import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatabaseNoteService } from 'src/app/database-note/database-note.service';
import { DatabaseNote } from 'src/app/database-note/model/database-note.model';
import { MessageCreator } from 'src/app/util/messageCreator';

@Component({
  selector: 'app-noteeditor',
  templateUrl: './noteeditor.component.html',
  styleUrls: ['./noteeditor.component.scss']
})
export class NoteeditorComponent implements OnInit {
  faCheck = faCheck;
  faTimes = faTimes;

  @Input() noteTable: string;
  //Height. Only in this format: "150px"
  @Input() height: string = "170px";

  //Database was not saved before - must be add to database (first time). 
  noteNotCreated: boolean;

  noteId: number;
  noteContent: string = "";
  noteLastUpdateDate: string = "";
  editorConfig: AngularEditorConfig = {};

  constructor(private databaseNoteService: DatabaseNoteService, private messageCreator: MessageCreator) {
  }

  ngOnInit(): void {
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: this.height,
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: '',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' }
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['insertImage', 'insertVideo']
      ]
    };

    this.loadDatabaseNote();
  }

  loadDatabaseNote() {
    this.databaseNoteService.getNoteByTablename(this.noteTable).subscribe((databaseNote: DatabaseNote) => {
      this.noteNotCreated = false;
      this.noteId = databaseNote.id;
      this.noteContent = databaseNote.noteText;
      let noteDateString = JSON.stringify(databaseNote.date);
      let noteDateParsed = new Date(JSON.parse(noteDateString))
      this.noteLastUpdateDate = noteDateParsed.getDate() + "." + noteDateParsed.getMonth() + "." + noteDateParsed.getFullYear();
    }, err => {
      this.noteNotCreated = true;
      console.log(err);
    });
  }

  saveDatabaseNote() {
    if (this.noteNotCreated) {
      this.databaseNoteService.saveNote(this.noteTable, this.noteContent, new Date()).subscribe(
        res => {
          let currentDate = new Date();
          this.noteLastUpdateDate = currentDate.getDate() + "." + (currentDate.getMonth()+1) + "." + currentDate.getFullYear();
        },
        err => {
          this.messageCreator.showErrorMessage("databaseNoteError1");
          console.log(err);
        })
    } else {
      this.databaseNoteService.updateDatabaseNote(this.noteId, this.noteTable, this.noteContent, new Date()).subscribe(
        res => {
          let currentDate = new Date();
          this.noteLastUpdateDate = currentDate.getDate() + "." + (currentDate.getMonth()+1) + "." + currentDate.getFullYear();
        },
        err => {
          this.messageCreator.showErrorMessage("databaseNoteError1");
          console.log(err);
        })
    }
  }

  deleteDatabaseNote() {
    this.noteContent = "";
    this.saveDatabaseNote();
  }

}
