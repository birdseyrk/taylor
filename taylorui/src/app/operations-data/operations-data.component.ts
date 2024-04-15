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

// @Injectable()
// export class MyService {
//   constructor(@Inject(DOCUMENT) private document: Document) {}
// }
export class OperationsDataComponent {
  constructor(
    private confirmationService: ConfirmationService,
    public elevationService: ElevationService,
    private myLog: LoggingService,
    private messageService: MessageService,
    public operationsService: OperationsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  //document = inject(DOCUMENT);
  //  DOCUMENT = new InjectionToken<Document>;

  myDate: Date = new Date();
  operationsData: any;
  operationMonthlyData: any = [];
  startingEOMContent: number = 0.0;
  eomContentLabel: string = '';
  yearTypeLabel: string = '';
  yearTypeBackground: string = '';

  operations: string[] = [];
  proposedOperations: any = '';

  elevationGridData: any = '';
  elevationGridOptions: any = '';

  dataDialogVisible = false;
  elevationVisible = false;
  clearOperationDataVisible = false;
  calendarVisible = false;

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
  }

  showElevationDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showElevationDialog --------'
    );

    this.elevationVisible = !this.elevationVisible;
  }

  showCalendarDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showCalendarDialog --------'
    );
    this.calendarVisible = !this.calendarVisible;
  }

  // @HostListener('window:keydown.enter', ['$event'])
  // handleKeyUp(event: KeyboardEvent) {
  //   this.myLog.log('INFO', '-------- OperationsDataComponent.handleKeyUp --------');
  //   // if(window.keydown.enter == KEY_CODE.DOWN_ARROW){
  //   //   // Your row selection code
  //   //   console.log(event);
  //   // }

  //   console.log(event);
  // }

  // KeyboardEventNames:any = 'keydown' | 'keyup';

  // let listenTo = (window: Window) => {
  //   const eventNames: KeyboardEventNames[] = ['keydown', 'keyup'];
  //   eventNames.forEach(eventName => {
  //      window.addEventListener(eventName, e => {
  //        handleEvent(e);
  //      });
  //   });
  // }

  handleKeyUpEvent = (event: any, column: string, index: string) => {
    this.myLog.log('INFO', '***** handleEvent ******');
    // const { key } = event;
    console.log(event);
    console.log(event.key);
    console.log(column);
    console.log(index);
    console.log(this.operationMonthlyData.length);
    let myRows = this.operationMonthlyData.length - 1;
    let myIndex = Number(index);
    let myKey = '';

    console.log(myKey);
    //console.log(this.document.querySelector("#manualInflow_0"));

    // let nextElementSiblingId = 'input'+ i+1;
    // if (i<this.things.controls.length) {
    //  document.querySelector(`#${nextElementSiblingId}`).focus()
    // }

    if (myIndex < this.operationMonthlyData.length && myIndex > -1) {
      if (event.key === 'Enter') {
        this.myLog.log('INFO', 'Enter');
        myKey = '#' + column + (myIndex + 1);
        console.log(myKey);
        console.log(this.document.querySelector(myKey));
        // let myInput = this.document.querySelector(myKey);
        // myInput.focus();
      } else if (event.key === 'ArrowDown') {
        this.myLog.log('INFO', 'ArrowDown');
        myKey = '#' + column + (myIndex + 1);
        console.log(myKey);
        console.log(this.document.querySelector(myKey));
        this.document.querySelector(myKey);
        //this.document.querySelector(`#${myKey}`).focus();
      } else if (event.key === 'ArrowUp') {
        this.myLog.log('INFO', 'ArrowUp');
        myKey = '#' + column + (myIndex - 1);
        console.log(myKey);
        //this.document.querySelector(`#${myKey}`).focus();

        console.log(this.document.querySelector(myKey));
        this.document.querySelector(myKey);
      } else if (event.key === 'ArrowRight') {
        this.myLog.log('INFO', 'ArrowRight');
      } else if (event.key === 'ArrowLeft') {
        this.myLog.log('INFO', 'ArrowLeft');
      }
    }
  };

  // myNavigate(event: KeyboardEventEvent) {
  //   console.log(index);
  //   const inputs = this.inputEl.nativeElement.querySelectorAll('input');
  //   if (inputs.length > index + 1) {
  //     inputs[index + 1].focus();
  //   }
  // }

  // // confirm1(event: Event) {
  // //   this.confirmationService.confirm({
  // //       target: event.target as EventTarget,
  // //       message: 'Are you sure you want to proceed?',
  // //       icon: 'pi pi-exclamation-triangle',
  // //       accept: () => {
  // //           this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  // //       },
  // //       reject: () => {
  // //           this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  // //       }
  // //   });
  // // }

  // confirm2(event: Event) {
  //     this.confirmationService.confirm({
  //         target: event.target as EventTarget,
  //         message: 'Do you want to delete this record?',
  //         icon: 'pi pi-info-circle',
  //         acceptButtonStyleClass: 'p-button-danger p-button-sm',
  //         accept: () => {
  //             this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Data Cleared', life: 2000 });

  //             //setTimeout(this.closeClearOperationalDataDialog, 2100);

  //             this.clearOperationalData();

  //           //   this.closeDialogTimer.subscribe(x => {
  //           //     this.myLog.log('INFO', '');
  //           //     this.myLog.log('INFO', '********** Remove Dialog: ********** ', x);
  //           //     this.clearOperationDataVisible = !this.clearOperationDataVisible;
  //           //     clearInterval(this.closeTime);
  //           // });
  //         },
  //         reject: () => {
  //             this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 2000 });
  //             //setTimeout(this.closeClearOperationalDataDialog, 2100);

  //           //   this.closeDialogTimer.subscribe(x => {
  //           //     this.myLog.log('INFO', '');
  //           //     this.myLog.log('INFO', '********** Remove Dialog: ********** ', x);
  //           //     this.clearOperationDataVisible = !this.clearOperationDataVisible;
  //           // });
  //         }
  //     });
  //     setTimeout(this.closeClearOperationalDataDialog, 2100);
  // }

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

    //console.log(elevationAdjustedData);

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

    //console.log(this.elevationGridData);

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
    //this.elevationGridData.datasets[3] = inFlowData;
    //this.elevationGridData.datasets[4] = outFlowData;
    this.elevationGridData.labels = myLabels;

    //console.log(this.elevationGridData);

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
    if (this.proposedOperations.length > 0) {
      this.operations = this.operationsService.getOperations(
        this.proposedOperations
      );
    } else {
      this.myLog.log('INFO', 'proposedOperations data is empty');
    }

    //console.log(this.operations);
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

    if (myInflow > 0) {
      this.operationMonthlyData[Number(inputData.index)].manualInflow =
        myInflow;
    }
    if (myOutflow > 0) {
      this.operationMonthlyData[Number(inputData.index)].manualOutflow =
        myOutflow;
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

      if (Number(this.operationMonthlyData[i].manualInflow) === 0) {
        myInflow = Number(this.operationMonthlyData[i].inflow);
      } else {
        myInflow = Number(this.operationMonthlyData[i].manualInflow);
      }

      if (this.operationMonthlyData[i].manualOutflow === 0) {
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
    //console.log(this.operationMonthlyData);

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

    //console.log(eomContent);

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
        //console.log(data[i].inflow);
        this.yearTypeInflow = this.yearTypeInflow + data[i].inflow;
      }
    }
    //console.log(this.yearTypeInflow);
  }

  getOperationData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getOperationData --------'
    );

    this.startingEOMContent = 0.0;
    let temp: any = this.operationsService.getJson();

    console.log('rkb getOperationData');
    //console.log(temp.length);
    console.log(temp);

    if (temp.data) {
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
  }
}
