import { Component, Input, OnInit } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatabaseNoteService } from 'src/app/database-note/database-note.service';

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
  noteContent: string = "";
  noteLastUpdateDate: string = "";
  editorConfig: AngularEditorConfig = {};

  constructor(private databaseNoteService: DatabaseNoteService) {
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
//TODO USER ID laden von user-authentication - muss in der app gecasht session object sein. 
 //   this.databaseNoteService.getNoteByTablename()
  }


}
