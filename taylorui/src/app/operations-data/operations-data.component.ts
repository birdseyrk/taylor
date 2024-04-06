import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { interval, Subscription, take } from 'rxjs';

import { ElevationService } from '../elevation.service';
import { OperationsService } from '../operations.service';
import * as constants from '../../constants';

@Component({
  selector: 'app-operations-data',
  templateUrl: './operations-data.component.html',
  styleUrl: './operations-data.component.css',
  providers: [ConfirmationService, MessageService]
})

export class OperationsDataComponent {
  constructor(
    public operationsService: OperationsService,
    public elevationService: ElevationService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  myDate: Date = new Date;
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
    console.log('-------- OperationsDataComponent.showClearOperationalDataDialog -------- ' + this.clearOperationDataVisible );

    this.clearOperationDataVisible = !this.clearOperationDataVisible;
  }

  closeClearOperationalDataDialog() {
    console.log('-------- OperationsDataComponent.closeClearOperationalDataDialog -------- ' );

    this.clearOperationDataVisible = false;
  }

  showDataDialog() {
    console.log('-------- OperationsDataComponent.showDataDialog --------');

    this.dataDialogVisible = !this.dataDialogVisible;
  }

  clearOperationalData() {
    console.log('-------- OperationsDataComponent.clearOperationalData --------');

    this.startingEOMContent = 0.0;
    this.eomContentLabel = '';
    this.elevationGridData = {};
    this.elevationGridOptions = '';
    this.eomContentLabel = '';
    this.yearTypeLabel = '';
    this.proposedOperations = '';
    this.operationsService.clearOperationalData();
    this.operationMonthlyData = [];
    this.clearOperationDataVisible = false;
  }

  showElevationDialog() {
    console.log('-------- OperationsDataComponent.showElevationDialog --------');

    this.elevationVisible = !this.elevationVisible;
  }

  showCalendarDialog() {
    console.log('-------- OperationsDataComponent.showCalendarDialog --------');
    this.calendarVisible = !this.calendarVisible;

  }

// confirm1(event: Event) {
//   this.confirmationService.confirm({
//       target: event.target as EventTarget,
//       message: 'Are you sure you want to proceed?',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//           this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
//       },
//       reject: () => {
//           this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
//       }
//   });
// }

confirm2(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Data Cleared', life: 2000 });

            //setTimeout(this.closeClearOperationalDataDialog, 2100);

            this.clearOperationalData();

          //   this.closeDialogTimer.subscribe(x => {
          //     console.log("");
          //     console.log("");
          //     console.log('********** Remove Dialog: ********** ', x);
          //     this.clearOperationDataVisible = !this.clearOperationDataVisible;
          //     clearInterval(this.closeTime);
          // });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 2000 });
            //setTimeout(this.closeClearOperationalDataDialog, 2100);

          //   this.closeDialogTimer.subscribe(x => {
          //     console.log("");
          //     console.log("");
          //     console.log('********** Remove Dialog: ********** ', x);
          //     this.clearOperationDataVisible = !this.clearOperationDataVisible;
          // });
        }
    });
    setTimeout(this.closeClearOperationalDataDialog, 2100);
}

  setYearType() {
    console.log('-------- OperationsDataComponent.setYearType --------');

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
    console.log('-------- OperationsDataComponent.addToGridElevation --------');

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

    console.log(elevationAdjustedData);

    for (let i = 0; i < this.operationMonthlyData.length; i++) {
      myModifiedData[i] = this.operationMonthlyData[i].eomElevation;
    }

    elevationAdjustedData.data = myModifiedData;

    this.elevationGridData.datasets[3] = elevationAdjustedData;
  }

  getElevationGridData() {
    console.log(
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

    console.log(this.elevationGridData);

    for (let i = 0; i < this.operationMonthlyData.length; i++) {
      myProposedData[i] = this.operationMonthlyData[i].eomElevation;
      myInflowData[i] = Number(this.operationMonthlyData[i].inflow)
      myOutflowData[i] = Number(this.operationMonthlyData[i].outflow)
      myLabels[i] =
        this.operationMonthlyData[i].month +
        ' ' +
        this.operationMonthlyData[i].dateRange;
      myWarning[i] = constants.WARNING_ELEVATION_LEVEL;
      myMax[i] = constants.MAX_ELEVATION_LEVEL;
    }

    elevationProposedData.data = myProposedData;
    inFlowData.data  = myInflowData;
    outFlowData.data = myOutflowData;
    elevationWarningData.data = myWarning;
    elevationMaxData.data = myMax;

    this.elevationGridData.datasets[0] = elevationWarningData;
    this.elevationGridData.datasets[1] = elevationMaxData;
    this.elevationGridData.datasets[2] = elevationProposedData;
    //this.elevationGridData.datasets[3] = inFlowData;
    //this.elevationGridData.datasets[4] = outFlowData;
    this.elevationGridData.labels = myLabels;

    console.log(this.elevationGridData);

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
    console.log('-------- OperationsDataComponent.processData --------');
    if (this.proposedOperations.length > 0) {
      this.operations = this.operationsService.getOperations(
        this.proposedOperations
      );
    } else {
      console.log('proposedOperations data is empty');
    }

    console.log(this.operations);
    this.showDataDialog();
    this.getOperationData();
  }

  clearData(event: MouseEvent) {
    this.proposedOperations = '';
  }

  getEOMContent(baseContent: number, inflow: number, outflow: number): number {
    console.log(
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
    console.log(
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
    console.log(
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
    console.log(
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
    console.log(this.operationMonthlyData);

    this.addToGridElevation();
  }

  getEOMContentList(data: any): number[] {
    console.log('-------- OperationsDataComponent.getEOMContentList --------');

    let eomContent = new Array();

    let myEomContent = 0;

    eomContent = [];

    for (let i = 0; i < data.length; i++) {
      myEomContent = this.startingEOMContent + data[i].inflow - data[i].outflow;
      eomContent.push(myEomContent);
    }

    console.log(eomContent);

    return eomContent;
  }

  setEOMContentList(data: any, baseContent: number) {
    console.log('-------- OperationsDataComponent.setEOMContentList --------');

    let baseEOM = 0;
    this.yearTypeInflow = 0.0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        baseEOM = this.startingEOMContent;
      } else {
        baseEOM = data[i - 1].eomContent;
      }

      let myEOM = this.setEOMContent(baseEOM, data[i].inflow, data[i].outflow);
      data[i].eomContent = myEOM;

      if ( (i > 9) && (i<18)) {
        console.log(data[i].inflow);
        this.yearTypeInflow = this.yearTypeInflow + data[i].inflow;
      }
    }
    console.log(this.yearTypeInflow);
  }

  getOperationData() {
    console.log('-------- OperationsDataComponent.getOperationData --------');

    this.startingEOMContent = 0.0;
    let temp: any = this.operationsService.getJson();

    if (temp) {
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
