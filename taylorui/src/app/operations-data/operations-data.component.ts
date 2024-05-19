import { Inject, Injectable, Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from '@angular/common/http';

import { interval, Subscription, take, Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ElevationService } from '../elevation.service';
import { LoggingService } from '../logging.service';
import { OperationsService } from '../operations.service';
import * as constants from '../../constants';

@Component({
  selector: 'app-operations-data',
  templateUrl: './operations-data.component.html',
  styleUrl: './operations-data.component.css',
  providers: [ConfirmationService, MessageService],
})

export class OperationsDataComponent {
  constructor(
    private confirmationService: ConfirmationService,
    public elevationService: ElevationService,
    private myLog: LoggingService,
    private messageService: MessageService,
    public operationsService: OperationsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  myDate: Date = new Date();
  operationsData: any;
  operationMonthlyData: any = [];
  startingEOMContent: number = 0.0;
  eomContentLabel: string = '';
  yearTypeLabel: string = '';
  yearTypeBackground: string = '';
  errors: any = [];

  operations: string[] = [];
  proposedOperations: any = '';

  elevationGridData: any = '';
  elevationGridOptions: any = '';

  calendarVisible = false;
  clearOperationDataVisible = false;
  dataDialogVisible = false;
  elevationVisible = false;
  errorInputVisible = false;

  yearTypeInflow = 0.0;
  recaculateYearType = 0.0;

  showClearOperationalDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showClearOperationalDataDialog -------- ' +
        this.clearOperationDataVisible
    );

    this.clearOperationDataVisible = !this.clearOperationDataVisible;
  }

  closeClearOperationalDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.closeClearOperationalDataDialog -------- '
    );

    this.clearOperationDataVisible = false;
  }

  closeErrorInputDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.closeErrorInputDialog -------- '
    );

    this.errorInputVisible = false;
  }

  showDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showDataDialog --------'
    );

    this.dataDialogVisible = !this.dataDialogVisible;
  }

  clearOperationalData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.clearOperationalData --------'
    );

    this.startingEOMContent = 0.0;
    this.yearTypeInflow = 0.0;
    this.eomContentLabel = '';
    this.elevationGridData = {};
    this.elevationGridOptions = '';
    this.eomContentLabel = '';
    this.yearTypeLabel = '';
    this.yearTypeBackground = '';
    this.proposedOperations = '';
    this.operationsService.clearOperationalData();
    this.operationMonthlyData = [];
    this.clearOperationDataVisible = false;
    this.errors = [];
  }

  showElevationDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showElevationDialog --------'
    );

    this.elevationVisible = !this.elevationVisible;
  }

  showErrorInputDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.errorInputVisible --------'
    );

    this.errorInputVisible = !this.errorInputVisible;
  }

  showCalendarDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showCalendarDialog --------'
    );
    this.calendarVisible = !this.calendarVisible;
  }

  handleKeyUpEvent = (event: any, column: string, index: string) => {
    this.myLog.log('INFO', '***** handleEvent ******');
    let myIndex = Number(index);
    let myKey = '';

    if (myIndex < this.operationMonthlyData.length && myIndex > -1) {
      if (event.key === 'Enter') {
        this.myLog.log('INFO', 'Enter');
        myKey = '#' + column + (myIndex + 1);
      } else if (event.key === 'ArrowDown') {
        this.myLog.log('INFO', 'ArrowDown');
        myKey = '#' + column + (myIndex + 1);
        this.document.querySelector(myKey);
      } else if (event.key === 'ArrowUp') {
        this.myLog.log('INFO', 'ArrowUp');
        myKey = '#' + column + (myIndex - 1);
        this.document.querySelector(myKey);
      } else if (event.key === 'ArrowRight') {
        this.myLog.log('INFO', 'ArrowRight');
      } else if (event.key === 'ArrowLeft') {
        this.myLog.log('INFO', 'ArrowLeft');
      }
    }
  };

  setYearType() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.setYearType --------'
    );

    this.yearTypeBackground = '';

    if (this.yearTypeInflow < constants.DRY_YEAR.low) {
      this.yearTypeLabel = constants.DRY_YEAR_LABEL;
      this.yearTypeBackground = constants.DRY_YEAR_BACKGROUND;
    } else if (this.yearTypeInflow < constants.WET_YEAR.low) {
      this.yearTypeLabel = constants.AVG_YEAR_LABEL;
      this.yearTypeBackground = constants.AVG_YEAR_BACKGROUND;
    } else {
      this.yearTypeLabel = constants.WET_YEAR_LABEL;
      this.yearTypeBackground = constants.WET_YEAR_BACKGROUND;
    }
  }

  addToGridElevation() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.addToGridElevation --------'
    );

    let myModifiedData: any = [];

    let myAdjustedLevel =
      '{"data":[],"backgroundColor":"' +
      constants.ADJUST_GRID_BACKGROUND +
      '","fill":false,"borderColor":"' +
      constants.ADJUST_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      constants.ADJUST_LABEL +
      '"}';
    let elevationAdjustedData = JSON.parse(myAdjustedLevel);

    for (let i = 0; i < this.operationMonthlyData.length; i++) {
      myModifiedData[i] = this.operationMonthlyData[i].eomElevation;
    }

    elevationAdjustedData.data = myModifiedData;

    this.elevationGridData.datasets[3] = elevationAdjustedData;
  }

  getElevationGridData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getElevationGridData --------'
    );

    let myJSONstring = '{"datasets":[],"labels":[]}';
    let myProposedLevel =
      '{"data":[],"backgroundColor":"' +
      constants.PROPOSED_GRID_BACKGROUND +
      '","fill":true,"borderColor":"' +
      constants.PROPOSED_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      constants.PROPOSED_LABEL +
      '"}';
    let myOutFlowLevel =
      '{"data":[],"borderColor":"' +
      constants.OUTFLOW_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      constants.OUTFLOW_LABEL +
      '"}';
    let myInFlowLevel =
      '{"data":[],"borderColor":"' +
      constants.INFLOW_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      constants.INFLOW_LABEL +
      '"}';
    let myWarningLevel =
      '{"data":[],"backgroundColor":"' +
      constants.WARNING_GRID_BACKGROUND +
      '","borderDash": [5, 5],"fill":false,"borderColor":"' +
      constants.WARNING_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      constants.WARNING_LABEL +
      '"}';
    let myMaxLevel =
      '{"data":[],"backgroundColor":"' +
      constants.MAX_GRID_BACKGROUND +
      '","borderDash": [5, 5],"fill":false,"borderColor":"' +
      constants.MAX_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      constants.MAX_LABEL +
      '"}';

    let myProposedData: any = [];
    let myInflowData: any = [];
    let myOutflowData: any = [];
    let myLabels: any = [];
    let myWarning: any = [];
    let myMax: any = [];

    this.elevationGridData = JSON.parse(myJSONstring);
    let elevationProposedData = JSON.parse(myProposedLevel);
    let outFlowData = JSON.parse(myOutFlowLevel);
    let inFlowData = JSON.parse(myInFlowLevel);
    let elevationWarningData = JSON.parse(myWarningLevel);
    let elevationMaxData = JSON.parse(myMaxLevel);

    for (let i = 0; i < this.operationMonthlyData.length; i++) {
      myProposedData[i] = this.operationMonthlyData[i].eomElevation;
      myInflowData[i] = Number(this.operationMonthlyData[i].inflow);
      myOutflowData[i] = Number(this.operationMonthlyData[i].outflow);
      myLabels[i] =
        this.operationMonthlyData[i].month +
        ' ' +
        this.operationMonthlyData[i].dateRange;
      myWarning[i] = constants.WARNING_ELEVATION_LEVEL;
      myMax[i] = constants.MAX_ELEVATION_LEVEL;
    }

    elevationProposedData.data = myProposedData;
    inFlowData.data = myInflowData;
    outFlowData.data = myOutflowData;
    elevationWarningData.data = myWarning;
    elevationMaxData.data = myMax;

    this.elevationGridData.datasets[0] = elevationWarningData;
    this.elevationGridData.datasets[1] = elevationMaxData;
    this.elevationGridData.datasets[2] = elevationProposedData;
    this.elevationGridData.labels = myLabels;


    this.elevationGridOptions = {
      plugins: {
        legend: {
          labels: {
            color: constants.GRID_LEGEND_LABEL,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: constants.GRID_SCALES_LABEL,
          },
        },
      },
    };
  }

  processData(event: MouseEvent) {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.processData --------'
    );
    this.errors = [];
    if (this.proposedOperations.length > 0) {
      this.operations = this.operationsService.getOperations(
        this.proposedOperations
      );
    } else {
      this.myLog.log('INFO', 'proposedOperations data is empty');
    }

    this.showDataDialog();
    this.getOperationData();
  }

  clearData(event: MouseEvent) {
    this.proposedOperations = '';
  }

  getEOMContent(baseContent: number, inflow: number, outflow: number): number {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getEOMContent -------- ' +
        baseContent +
        ' ' +
        inflow +
        ' ' +
        outflow
    );

    return baseContent + inflow - outflow;
  }

  setEOMContent(baseContent: number, inflow: number, outflow: number): number {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.setEOMContent -------- ' +
        baseContent +
        ' ' +
        inflow +
        ' ' +
        outflow
    );

    return this.getEOMContent(baseContent, inflow, outflow);
  }

  getElevationWarning(elevation: number): any {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getElevationWarning --------'
    );

    let warning = '';
    if (elevation > constants.MAX_ELEVATION_LEVEL) {
      warning = constants.EOM_MAX_LEVEL;
    } else if (elevation > constants.WARNING_ELEVATION_LEVEL) {
      warning = constants.EOM_WARNING_LEVEL;
    }

    return warning;
  }

  recalculateEOM(inputData: any) {

    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.recalculateEOM -------- ' +
        inputData.index +
        ' ' +
        inputData.manualInflow
    );

    let myEomContent = 0;
    let myInflow = Number(inputData.manualInflow);
    let myOutflow = Number(inputData.manualOutflow);
    let myIndex = Number(inputData.index);
    this.recaculateYearType = 0.0;
    this.operationMonthlyData[Number(inputData.index)].manualInflowColor = "";
    this.operationMonthlyData[Number(inputData.index)].manualOutFlowColor = "";

    if (myInflow > 0) {
      this.operationMonthlyData[Number(inputData.index)].manualInflow =
        myInflow;
        this.operationMonthlyData[Number(inputData.index)].manualInflowColor = constants.CELL_CHANGE_COLOR;
    }
    if (myOutflow > 0) {
      this.operationMonthlyData[Number(inputData.index)].manualOutflow =
        myOutflow;
        
      this.operationMonthlyData[Number(inputData.index)].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
    }

    for (
      let i = Number(inputData.index);
      i < this.operationMonthlyData.length;
      i++
    ) {

      if (i === 0) {
        myEomContent = this.startingEOMContent;
      } else {
        myEomContent = this.operationMonthlyData[i - 1].eomContent;
      }

      if (!myOutflow) {
        myOutflow = 0;
      }

      if (!myInflow) {
        myInflow = 0;
      }

      if ( (!this.operationMonthlyData[i].manualInflow) || (Number(this.operationMonthlyData[i].manualInflow) === 0) ) {
        myInflow = Number(this.operationMonthlyData[i].inflow);
      } else {
        myInflow = Number(this.operationMonthlyData[i].manualInflow);
      }

      if ( (!this.operationMonthlyData[i].manualOutflow) || (this.operationMonthlyData[i].manualOutflow === 0)) {
        myOutflow = this.operationMonthlyData[i].outflow;
      } else {
        myOutflow = Number(this.operationMonthlyData[i].manualOutflow);
      }

      this.operationMonthlyData[i].eomContent =
        myEomContent + myInflow - myOutflow;

      this.operationMonthlyData[i].eomElevation =
        this.elevationService.getElevation(
          this.operationMonthlyData[i].eomContent
        );

      this.operationMonthlyData[i].elevationWarning = this.getElevationWarning(
        this.operationMonthlyData[i].eomElevation
      );
    }

    this.addToGridElevation();
  }

  getEOMContentList(data: any): number[] {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getEOMContentList --------'
    );

    let eomContent = new Array();

    let myEomContent = 0;

    eomContent = [];

    for (let i = 0; i < data.length; i++) {
      myEomContent = this.startingEOMContent + data[i].inflow - data[i].outflow;
      eomContent.push(myEomContent);
    }

    return eomContent;
  }

  setEOMContentList(data: any, baseContent: number) {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.setEOMContentList --------'
    );

    let baseEOM = 0;
    this.yearTypeInflow = 0.0;
    this.setYearType();

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        baseEOM = this.startingEOMContent;
      } else {
        baseEOM = data[i - 1].eomContent;
      }

      let myEOM = this.setEOMContent(baseEOM, data[i].inflow, data[i].outflow);
      data[i].eomContent = myEOM;

      if (i > 9 && i < 18) {
        
        this.yearTypeInflow = this.yearTypeInflow + data[i].inflow;
      }
    }
  }

  getOperationData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getOperationData --------'
    );

    this.startingEOMContent = 0.0;
    let temp: any = this.operationsService.getJson();
    this.errors = this.operationsService.getErrorsJson();

    if ( (temp.data) && (!this.errors.fatalError) ) {
      this.operationMonthlyData = temp.data;

      this.startingEOMContent = parseInt(temp.initialAcreFeet.replace(',', ''));

      this.eomContentLabel =
        'EOM Content ' +
        this.startingEOMContent +
        ' elevation ' +
        this.elevationService.getElevation(this.startingEOMContent).toFixed(2);

      this.setEOMContentList(
        this.operationMonthlyData,
        this.startingEOMContent
      );

      this.getElevationGridData();
      this.setYearType();
    }
    else if (this.errors.fatalError) {
      this.errorInputVisible = true;
    }
  }
}
