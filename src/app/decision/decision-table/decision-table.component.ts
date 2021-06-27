import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, SelectMultipleControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { faCheckSquare, faFolderOpen, faFont, faInfoCircle, faPlus, faPlusCircle, faTable } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ApiConfig } from 'src/app/util/api.config';
import { CssStyleAdjustment } from 'src/app/util/css-style-adjustment';
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
  selector: 'app-decision-table',
  templateUrl: './decision-table.component.html',
  styleUrls: ['./decision-table.component.scss']
})
export class DecisionTableComponent implements OnInit {

  loading: boolean;
  browserWidth;

  tableColumns: any[];
  exportColumns: any[];
  exportedColumns: any[];

  decisions: Decision[] = [];

  title: string;
  information: string;

  criteriaNumberCounter: number = 0;
  optionNumberCounter: number = 0;

  newCriteriasForm: FormGroup;
  newOptionsForm: FormGroup;
  newCriterias: CriteriaOption[];
  newOptions: DecisionOption[];
  newOptionPoints: CriteriaOptionPoint[];

  criteriaTitlePlaceholder: string;
  criteriaWeigthingPlaceholder: string;
  optionTitlePlaceholder: string;

  faFolderOpen = faFolderOpen;
  faPlusCircle = faPlusCircle;
  faFont = faFont;
  faInfoCircle = faInfoCircle;
  faCheckSquare = faCheckSquare;
  faTable = faTable;

  standardTableWidth = 1270;

  constructor(private router: Router, private cssStyleAdjustment: CssStyleAdjustment, private formBuilder: FormBuilder, private translateService: TranslateService, private messageCreator: MessageCreator, private messageService: MessageService, private appLanguageLoaderHelper: AppLanguageLoaderHelper, private apiConfig: ApiConfig, private decisionService: DecisionService, private decisionOptionService: DecisionOptionService, private criteriaOptionService: CriteriaOptionService, private optionPointService: OptionPointService) { }

  ngOnInit(): void {
    this.loading = true;
    this.browserWidth = window.innerWidth;
    this.translateService.get(['decision.decisionTableHeaderTitle', 'decision.decisionTableHeaderChosenOption', 'decision.decisionTableHeaderAvailableOptions', 'decision.decisionTableHeaderInformation', 'decision.decisionTableHeaderAddedDate', 'decision.criteriaTitlePlaceholder', 'decision.criteriaWeigthingPlaceholder', 'decision.optionTitlePlaceholder'],).subscribe(translations => {
      this.tableColumns = [
        { field: 'decisionId', header: 'ID' },
        { field: 'title', header: translations['decision.decisionTableHeaderTitle'] },
        { field: 'chosenOption', header: translations['decision.decisionTableHeaderChosenOption'] },
        { field: 'information', header: translations['decision.decisionTableHeaderInformation'] },
        { field: 'addedDate', header: translations['decision.decisionTableHeaderAddedDate'] },
      ];
      this.exportColumns = [
        { field: 'decisionId', header: 'ID' },
        { field: 'title', header: translations['decision.decisionTableHeaderTitle'] },
        { field: 'chosenOption', header: translations['decision.decisionTableHeaderChosenOption'] },
        { field: 'information', header: translations['decision.decisionTableHeaderInformation'] },
        { field: 'addedDate', header: translations['decision.decisionTableHeaderAddedDate'] },
      ];
      this.exportedColumns = this.exportColumns.map(column => ({ title: column.header, dataKey: column.field }));
      this.criteriaTitlePlaceholder = translations['decision.criteriaTitlePlaceholder'];
      this.criteriaWeigthingPlaceholder = translations['decision.criteriaWeigthingPlaceholder'];
      this.optionTitlePlaceholder = translations['decision.optionTitlePlaceholder'];
    }
    );
    this.loadDecisions();
    this.loadCriteriaOptionFormValue();
    this.newCriterias = [];
    this.newOptions = [];
    this.newOptionPoints = [];
  }

  ngAfterViewInit() {
    this.cssStyleAdjustment.loadTableResponsiveStyle(this.standardTableWidth);
  }

  loadDecisions() {
    this.decisionService.getAllDecisionTable().subscribe((decisions: Decision[]) => {
      this.decisions = decisions;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  loadCriteriaOptionFormValue() {
    this.newCriteriasForm = this.formBuilder.group({
      newCriteriasInput: this.formBuilder.array([])
    });
    this.newOptionsForm = this.formBuilder.group({
      newOptionsInput: this.formBuilder.array([])
    });

    (this.newCriteriasForm.controls['newCriteriasInput'] as FormArray).push(this.setCriteriasInputItem(this.criteriaNumberCounter, "", ""));
    this.criteriaNumberCounter++;
    (this.newCriteriasForm.controls['newCriteriasInput'] as FormArray).push(this.setCriteriasInputItem(this.criteriaNumberCounter, "", ""));
    (this.newOptionsForm.controls['newOptionsInput'] as FormArray).push(this.setOptionsInputItem(this.optionNumberCounter, ""));
    this.optionNumberCounter++;
    (this.newOptionsForm.controls['newOptionsInput'] as FormArray).push(this.setOptionsInputItem(this.optionNumberCounter, ""));
  }


  /**
   * Returns a form for one criteria with the passed values. This form will be added to a form group that has all criterias for a new decision. 
   * @param stageId 
   * @param stageNumber 
   * @param stageTitle 
   * @param stageDescription 
   * @param finished 
   */
  setCriteriasInputItem(criteriaId, criteriaTitle, criteriaWeighting) {
    return this.formBuilder.group({
      ['criteriaTitle' + criteriaId]: [criteriaTitle],
      ['criteriaWeighting' + criteriaId]: [criteriaWeighting]
    });
  }

  addNewCriteriaInput() {
    this.criteriaNumberCounter += 1;
    //The index from where new criteria are saved/added. From this index criterias are added and not updated.
    (this.newCriteriasForm.controls['newCriteriasInput'] as FormArray).push(this.setCriteriasInputItem(this.criteriaNumberCounter, "", ""));
  }

  /**
   * Returns a form for one option with the passed values. This form will be added to a form group that has all options for a new decision. 
   * @param stageId 
   * @param stageNumber 
   * @param stageTitle 
   * @param stageDescription 
   * @param finished 
   */
  setOptionsInputItem(optionId, optionTitle) {
    return this.formBuilder.group({
      ['optionTitle' + optionId]: [optionTitle]
    });
  }

  addNewOptionInput() {
    this.optionNumberCounter += 1;
    //The index from where new option are saved/added. From this index options are added and not updated.
    (this.newOptionsForm.controls['newOptionsInput'] as FormArray).push(this.setOptionsInputItem(this.optionNumberCounter, ""));
  }

  openDecision(decisionId) {
    this.router.navigate(['/decision/edit/' + decisionId]);
  }

  saveDecision() {
    if (this.title === null || this.title.trim() === "") {
      this.messageCreator.showErrorMessage("decisionAddError1");
      return;
    }
    this.loading=true;

    this.decisionService.saveDecision(this.title, null, -1, this.information, new Date()).subscribe((savedDecision: Decision) => {
      this.addDecisionOption(savedDecision);
    }, err => {
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }

  addDecisionOption(savedDecision: Decision) {
    let optionsFormArray = (this.newOptionsForm.controls['newOptionsInput'] as FormArray);
    let savedItems = 0;
    let index = 0;
    let optionsFormItem = optionsFormArray.controls[index];

    this.decisionOptionService.saveDecisionOption((optionsFormItem.get(['optionTitle' + index])).value, savedDecision).subscribe((savedDecisionOption: DecisionOption) => {
      this.newOptions.push(savedDecisionOption);
      savedItems++;
      this.addAdditionalDecisionOptions(savedDecision, optionsFormArray, index, savedItems);
    }, err => {
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }

  /**
   * Add the next decision options. Recursive call to ensure correct order. 
   * @param savedDecision 
   * @param optionsFormArray 
   * @param index 
   * @param savedItems 
   */
  addAdditionalDecisionOptions(savedDecision: Decision, optionsFormArray: FormArray, index: number, savedItems: number) {
    index++;
    let optionsFormItem = optionsFormArray.controls[index];

    this.decisionOptionService.saveDecisionOption((optionsFormItem.get(['optionTitle' + index])).value, savedDecision).subscribe((savedDecisionOption: DecisionOption) => {
      this.newOptions.push(savedDecisionOption);
      savedItems++;
      if (savedItems === optionsFormArray.controls.length) {
        //All DecisionOptions added. Start adding Criteria Points
        this.addCriteriaOption(savedDecision);
      } else {
        this.addAdditionalDecisionOptions(savedDecision, optionsFormArray, index, savedItems);
      }
    }, err => {
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }

  addCriteriaOption(savedDecision: Decision) {
    let criteriasFormArray = (this.newCriteriasForm.controls['newCriteriasInput'] as FormArray);
    let savedItems = 0;
    let index = 0;
    let criteriaFormItem = criteriasFormArray.controls[index];

    this.criteriaOptionService.saveCriteriaOption((criteriaFormItem.get(['criteriaTitle' + index]).value), (criteriaFormItem.get(['criteriaWeighting' + index]).value), savedDecision).subscribe((savedCriteriaOption: CriteriaOption) => {
      savedItems++;
      this.newCriterias.push(savedCriteriaOption);
      this.addAdditionalCriteriaOptions(savedDecision, criteriasFormArray, index, savedItems);
    }, err => {
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }


  /**
   * Add the next decision criterias. Recursive call to ensure correct order. 
   * @param savedDecision 
   * @param optionsFormArray 
   * @param index 
   * @param savedItems 
   */
  addAdditionalCriteriaOptions(savedDecision: Decision, criteriasFormArray: FormArray, index: number, savedItems: number) {
    index++;
    let criteriaFormItem = criteriasFormArray.controls[index];

    this.criteriaOptionService.saveCriteriaOption((criteriaFormItem.get(['criteriaTitle' + index]).value), (criteriaFormItem.get(['criteriaWeighting' + index]).value), savedDecision).subscribe((savedCriteriaOption: CriteriaOption) => {
      this.newCriterias.push(savedCriteriaOption);
      savedItems++;

      //All CriteriaOptions added. Start adding Option Points
      if (savedItems === criteriasFormArray.controls.length) {
        this.addOptionPoint(savedDecision.decisionId);
      } else {
        this.addAdditionalCriteriaOptions(savedDecision, criteriasFormArray, index, savedItems);
      }
    }, err => {
      console.log(err);
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }

  addOptionPoint(savedDecisionId: number) {
    let indexCriteria = 0;
    let indexOption = 0;
    this.optionPointService.saveOptionPoint(this.newOptions[indexOption].decisionoptionId, this.newCriterias[indexCriteria].criteriaoptionId, savedDecisionId, 0, 0).subscribe((savedOptionPoint: CriteriaOptionPoint) => {
      this.newOptionPoints.push(savedOptionPoint);
      if (indexCriteria === (this.newCriterias.length - 1) && indexOption === (this.newOptions.length - 1)) {
        this.loadDecisions();
        this.messageCreator.showSuccessMessage("decisionAddOk1");
      } else {
        this.addAdditionalOptionPoints(savedDecisionId, indexCriteria, indexOption);
      }
    }, err => {
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }

  /**
   * Add all points for all options in every criteria. Recursive call to ensure correct order. 
   * @param savedDecisionId 
   * @param indexCriteria 
   * @param indexOption 
   */
  addAdditionalOptionPoints(savedDecisionId: number, indexCriteria: number, indexOption: number) {
    indexOption++;
    if (indexOption > (this.newOptions.length - 1)) {
      indexCriteria++;
      indexOption = 0;
    }

    this.optionPointService.saveOptionPoint(this.newOptions[indexOption].decisionoptionId, this.newCriterias[indexCriteria].criteriaoptionId, savedDecisionId, 0, 0).subscribe((savedOptionPoint: CriteriaOptionPoint) => {
      this.newOptionPoints.push(savedOptionPoint);

      if (indexCriteria === (this.newCriterias.length - 1) && indexOption === (this.newOptions.length - 1)) {
        //All option points for every criteria and its options are added - finished
        this.loadDecisions();
        this.messageCreator.showSuccessMessage("decisionAddOk1");
        this.loading=false;
      } else {
        this.addAdditionalOptionPoints(savedDecisionId, indexCriteria, indexOption);
      }
    }, err => {
      this.loading = false;
      this.messageCreator.showErrorMessage("decisionAddError2");
    });
  }

  /**
  * Update row value for a Decision row item. 
  * @param newValue 
  * @param decisionItem 
  * @param columnName The column / attribute of the decision item that will be updated
  */
  updateDecisionValue(newValue, decisionItem, columnName) {
    //Load objects through the title

    if (columnName === "title") {
      this.decisionService.updateDecisionTable(decisionItem.decisionId, newValue, decisionItem.chosenOption, decisionItem.chosenOptionId, decisionItem.information).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('decisionTableUpdatedError1');
      });
    }
    else if (columnName === "chosenOption") {
      let chosenOptionValue = newValue as DecisionOption;
      this.decisionService.updateDecisionTable(decisionItem.decisionId, decisionItem.title, decisionItem.chosenOption, decisionItem.chosenOptionId, decisionItem.information).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('decisionTableUpdatedError1');
      });
    }
    if (columnName === "information") {
      this.decisionService.updateDecisionTable(decisionItem.decisionId, decisionItem.title, decisionItem.chosenOption, decisionItem.chosenOptionId, newValue).subscribe((res: String) => {
      }, err => {
        console.log("UPDATE FAILED!");
        console.log(err);
        this.messageCreator.showErrorMessage('decisionTableUpdatedError1');
      });
    }
  }

  deleteDecision(id) {
    this.decisionService.deleteDecision(parseInt(id)).subscribe(
      () => {
        this.translateService.get(['messages.decisionDeletedOk1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.decisionDeletedOk1']).replace('#?', id) });
        });
        this.loadDecisions();
      }, err => {
        this.translateService.get(['messages.decisionDeletedError1']).subscribe(translations => {
          this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.decisionDeletedError1']).replace('#?', id) });
        });
        this.loadDecisions();
      });
  }

}
