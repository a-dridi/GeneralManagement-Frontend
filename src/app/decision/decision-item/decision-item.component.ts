import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faCheckSquare, faClipboardCheck, faFolderPlus, faFont, faPlus, faSortNumericUpAlt, faTable, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ApiConfig } from 'src/app/util/api.config';
import { AppLanguageLoaderHelper } from 'src/app/util/languages.config';
import { MessageCreator } from 'src/app/util/messageCreator';
import { CriteriaOptionService } from '../criteria-option.service';
import { DecisionOptionService } from '../decision-option.service';
import { DecisionService } from '../decision.service';
import { CriteriaOption } from '../model/criteria-option.model';
import { DecisionOption } from '../model/decision-option.model';
import { Decision } from '../model/decision.model';
import { CriteriaOptionPoint } from '../model/criteria-option-point.model';
import { OptionPointService } from '../option-point.service';

@Component({
  selector: 'app-decision-item',
  templateUrl: './decision-item.component.html',
  styleUrls: ['./decision-item.component.scss']
})
export class DecisionItemComponent implements OnInit {

  criteriaoptionItems: CriteriaOption[];
  optionItems: DecisionOption[];
  decisionId: number;
  loadedDecision: Decision;
  criteriaOptionPointItems;
  loadedDecisionTitle: string = "";

  optionsTotalSum;
  largestTotalSum: number = 0;

  chosenOption: DecisionOption;
  newCriteriaName: string;
  newCriteriaWeighting: string = "1";
  newOptionName: string;

  chosenOptionPlaceholder: string;
  chosenOptionTitle: string = "";
  chosenOptionId: number = -1;

  faFolderPlus = faFolderPlus;
  faPlusSquare = faPlusSquare;
  faFont = faFont;
  faCheckSquare = faCheckSquare;
  faPlus = faPlus;
  faSortNumericUpAlt = faSortNumericUpAlt;
  faTable = faTable;
  faClipboardCheck = faClipboardCheck;
  faCheckCircle = faCheckCircle;

  constructor(private messageCreator: MessageCreator, private appLanguageLoaderHelper: AppLanguageLoaderHelper, private apiConfig: ApiConfig, private decisionOptionService: DecisionOptionService, private optionPointService: OptionPointService, private decisionService: DecisionService, private criteriaOptionService: CriteriaOptionService, private route: ActivatedRoute, private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.decisionId = params.decisionId;
      this.loadCriteriaOptions(params.decisionId);
      this.loadDecision(this.decisionId);
      this.loadDecisionOptions(this.decisionId);
    });
    this.loadInputEnterListener();

    this.translateService.get(['decision.chosenOptionPlaceholder'],).subscribe(translations => {
      this.chosenOptionPlaceholder = translations['decision.chosenOptionPlaceholder'];
    });
  }

  ngAfterViewInit() {
  }

  loadCriteriaOptions(decisionId) {
    this.criteriaOptionService.getAllCriteriaOptionOfDecision(decisionId).subscribe((criteriaOptions: CriteriaOption[]) => {
      this.criteriaoptionItems = criteriaOptions;
      this.loadCriteriaOptionPointsArray();
    }, err => { console.log(err); });
  }

  loadDecision(decisionId) {
    this.decisionService.getDecisionById(decisionId).subscribe((decision: Decision) => {
      this.loadedDecision = decision;
      this.loadedDecisionTitle = this.loadedDecision.title;
      this.chosenOptionId = this.loadedDecision.chosenOptionId;
      if (this.loadedDecision.chosenOption !== undefined && this.loadedDecision.chosenOption !== "") {
        this.chosenOptionTitle = this.loadedDecision.chosenOption;
      }
    }, err => {
    })
  }

  loadDecisionOptions(decisionId) {
    this.decisionOptionService.getAllDecisionOptionByDecision(decisionId).subscribe((decisionOptions: DecisionOption[]) => {
      this.optionItems = decisionOptions;
      this.loadPointsTotalsOfDecisionOptions();
    }, err => {
      console.log(err);
    });
  }

  loadPointsTotalsOfDecisionOptions() {
    this.optionsTotalSum = {};
    let calledOptions = 0;
    console.log(this.optionItems);
    this.optionItems.forEach((decisionOptionItem: DecisionOption, index: number) => {
      this.optionPointService.getPointsSumOfDecisionOption(decisionOptionItem.decisionoptionId).subscribe(totalSum => {
        calledOptions++;
        this.optionsTotalSum[decisionOptionItem.decisionoptionId] = (totalSum);
        if (calledOptions === this.optionItems.length) {
          this.largestTotalSum = this.getLargestValueOfDecisionOptionsSum(this.optionsTotalSum);
        }
      });
    }, err => {
      console.log(err);
    });
  }

  /**
   * Create array that contains CriteriaOptionPoint item and the criteria id as an index
   */
  loadCriteriaOptionPointsArray() {
    this.criteriaoptionItems.forEach((criteriaOptionItem: CriteriaOption) => {
      this.criteriaOptionPointItems = {};
      this.optionPointService.getAllOptionPointByCriteriaId(criteriaOptionItem.criteriaoptionId).subscribe((optionPoints: CriteriaOptionPoint[]) => {
        this.criteriaOptionPointItems[criteriaOptionItem.criteriaoptionId] = (optionPoints);
      }, err => {
        console.log(err);
      });
    });

    this.loadPointsTotalsOfDecisionOptions();
  }

  getLargestValueOfDecisionOptionsSum(decisionOptionsTotalSum): number {
    let largestSum = 0;
    let totalSumsArray: number[] = Object.values(decisionOptionsTotalSum);
    largestSum = Math.max(...totalSumsArray);
    return largestSum;
  }

  /**
   * Update OptionPoint point value and adjust the total score the optionpoint item. 
   * @param newPointValue 
   * @param optionPointItem 
   * @param criteriaoptionItem 
   * @returns 
   */
  updateOptionPointItem(newPointValue, optionPointItem: CriteriaOptionPoint, criteriaoptionItem: CriteriaOption) {
    this.optionPointService.updateOptionPoint(optionPointItem.optionpointId, optionPointItem.decisionOptionId, optionPointItem.criteriaId, optionPointItem.decisionId, newPointValue, newPointValue * criteriaoptionItem.criteriaWeighting).subscribe(() => {
      this.loadCriteriaOptions(this.decisionId);
    }, err => {
      console.log(err);
      this.messageCreator.showErrorMessage("decisionUpdateOptionPointError2");
    });
  }

  addNewCriteria() {
    if (this.newCriteriaName == null || this.newCriteriaName.trim() === "") {
      this.messageCreator.showErrorMessage("decisionAddCriteriaError1");
      return;
    }
    let parsedWeighting = this.newCriteriaWeighting;

    this.criteriaOptionService.saveCriteriaOption(this.newCriteriaName, parsedWeighting, this.loadedDecision).subscribe((savedCriteriaOption: CriteriaOption) => {
      this.optionItems.forEach((decisionOptionItem: DecisionOption) => {
        this.optionPointService.saveOptionPoint(decisionOptionItem.decisionoptionId, savedCriteriaOption.criteriaoptionId, this.loadedDecision.decisionId, 0, 0).subscribe((savedOptionPoint: CriteriaOptionPoint) => {
        }, err => { console.log(err) });
      });
      this.loadDecision(this.decisionId);
      this.loadCriteriaOptions(this.decisionId);
      this.loadDecisionOptions(this.decisionId);
      this.loadPointsTotalsOfDecisionOptions();
    }, err => {
      console.log(err);
      this.messageCreator.showErrorMessage("decisionAddCriteriaError3");
    });
  }

  addNewOption() {
    if (this.newOptionName == null || this.newOptionName.trim() === "") {
      this.messageCreator.showErrorMessage("decisionAddOptionError1");
      return;
    }

    this.decisionOptionService.saveDecisionOption(this.newOptionName, this.loadedDecision).subscribe(
      (savedDecisionOption: DecisionOption) => {
        this.criteriaoptionItems.forEach((criteriaOptionItem: CriteriaOption) => {
          this.optionPointService.saveOptionPoint(savedDecisionOption.decisionoptionId, criteriaOptionItem.criteriaoptionId, this.loadedDecision.decisionId, 0, 0).subscribe((savedOptionPoint: CriteriaOptionPoint) => {
          }, err => { console.log(err) });
          this.loadDecisionOptions(this.loadedDecision.decisionId);
          this.loadCriteriaOptions(this.decisionId);
        });
      }, err => {
        console.log(err);
        this.messageCreator.showErrorMessage("decisionAddOptionError3");
      });
  }

  selectChosenDecisionOption() {
    this.decisionService.setChosenDecisionOption(this.chosenOption.title, this.chosenOption.decisionoptionId, this.loadedDecision.decisionId).subscribe(() => {
      this.chosenOptionTitle = this.chosenOption.title;
      this.chosenOptionId = this.chosenOption.decisionoptionId;

      this.messageCreator.showSuccessMessage("decisionSelectOptionOk1");
    }, err => {
      console.log(err);
      this.messageCreator.showErrorMessage("decisionSelectOptionError1");
    });
  }

  /**
 * Submit input value when user enters "Enter". Add option to existing and loaded decision item. 
 */
  loadInputEnterListener() {
    let addOptionInput = document.getElementById("addOptionName");
    addOptionInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addOptionButton").click();
      }
    });
  }

}
