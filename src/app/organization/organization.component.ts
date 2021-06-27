import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  noteTableName = "Organization";
  noteHeight="170px";

  constructor() { }

  ngOnInit(): void {
  }

}
