import { Component, OnInit } from '@angular/core';
import { faUncharted } from '@fortawesome/free-brands-svg-icons';
import { faChartPie, faFilm, faMusic, faVideo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-table',
  templateUrl: './media-table.component.html',
  styleUrls: ['./media-table.component.scss']
})
export class MediaTableComponent implements OnInit {

  faUncharted = faUncharted;
  faMusic = faMusic;
  faFilm = faFilm;
  faVideo = faVideo;
  faChartPie = faChartPie;

  noteTableName = "Media";
  noteHeight = "180px";

  constructor() { }

  ngOnInit(): void {
  }

}
