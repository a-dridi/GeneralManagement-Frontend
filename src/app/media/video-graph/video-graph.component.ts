import { Component, OnInit } from '@angular/core';
import { faTable, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { MessageCreator } from 'src/app/util/messageCreator';
import { ValuesGenerator } from 'src/app/util/valuesGenerator';
import { VideoGraph } from '../model/video-graph.model';
import { VideoGraphService } from '../video-graph.service';

@Component({
  selector: 'app-video-graph',
  templateUrl: './video-graph.component.html',
  styleUrls: ['./video-graph.component.scss']
})
export class VideoGraphComponent implements OnInit {

  videoGenreAmountList: VideoGraph[];
  videoGenreAmountData: any;
  videoLanguageAmountList: VideoGraph[];
  videoLanguageAmountData: any;
  videoclipLanguageAmountList: VideoGraph[];
  videoclipLanguageAmountData: any;

  videoGenreAmountLabels: string[];
  videoGenreAmountValues: number[];
  videoLanguageAmountLabels: string[];
  videoLanguageAmountValues: number[];
  videoclipLanguageAmountLabels: string[];
  videoclipLanguageAmountValues: number[];

  faTable = faTable;
  faChartPie = faChartPie;

  constructor(private messageCreator: MessageCreator, private videoGraphService: VideoGraphService) { }

  ngOnInit(): void {
    this.loadVideoGenreAmountGraph();
    this.loadVideoLanguageAmountGraph();
    this.loadVideoclipLanguageAmountGraph();
  }

  loadVideoGenreAmountGraph() {
    this.videoGraphService.getVideoGenreAmountList().subscribe((videoGraph: VideoGraph[]) => {
      this.videoGenreAmountList = videoGraph;
      this.videoGenreAmountLabels = [];
      this.videoGenreAmountValues = [];
      videoGraph.forEach(videoGraphItem => {
        this.videoGenreAmountLabels.push(videoGraphItem.title);
        this.videoGenreAmountValues.push(videoGraphItem.amount);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(this.videoGenreAmountList.length);

      this.videoGenreAmountData = {
        labels: this.videoGenreAmountLabels,
        datasets: [
          {
            data: this.videoGenreAmountValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

  loadVideoLanguageAmountGraph() {
    this.videoGraphService.getVideoLanguageAmountList().subscribe((videoGraph: VideoGraph[]) => {
      this.videoLanguageAmountList = videoGraph;
      this.videoLanguageAmountLabels = [];
      this.videoLanguageAmountValues = [];
      videoGraph.forEach(videoGraphItem => {
        this.videoLanguageAmountLabels.push(videoGraphItem.title);
        this.videoLanguageAmountValues.push(videoGraphItem.amount);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(this.videoLanguageAmountList.length);

      this.videoLanguageAmountData = {
        labels: this.videoLanguageAmountLabels,
        datasets: [
          {
            data: this.videoLanguageAmountValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

  loadVideoclipLanguageAmountGraph() {
    this.videoGraphService.getVideoclipLanguageAmountList().subscribe((videoGraph: VideoGraph[]) => {
      this.videoclipLanguageAmountList = videoGraph;
      this.videoclipLanguageAmountLabels = [];
      this.videoclipLanguageAmountValues = [];
      videoGraph.forEach(videoGraphItem => {
        this.videoclipLanguageAmountLabels.push(videoGraphItem.title);
        this.videoclipLanguageAmountValues.push(videoGraphItem.amount);
      });
      let hexColorsArray = ValuesGenerator.getHexColorValuesArray(this.videoLanguageAmountList.length);

      this.videoclipLanguageAmountData = {
        labels: this.videoclipLanguageAmountLabels,
        datasets: [
          {
            data: this.videoclipLanguageAmountValues,
            backgroundColor: hexColorsArray,
            hoverBackgroundColor: hexColorsArray
          }
        ]
      };
    }, err => {
      console.log(err);
    });
  }

}
