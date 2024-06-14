import { Inject, Injectable, Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { interval, Subscription, take, Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ElevationService } from '../elevation.service';
import { LoggingService } from '../logging.service';
import { OperationsService } from '../operations.service';
import * as constants from '../../constants';
import { FileUploadEvent } from 'primeng/fileupload';
//import { saveAs } from 'file-saver';
//import * as fileSaver from 'file-saver';

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
  reportName: string = '';
  reportDate:string = '';
  reportYear:string = '';
  reportDay:string = '';
  reportMonth:string = '';
  forcastDate:string    = '';
  forcastPercent:string  = '';
  forcastAcreFeet:string = '';
  maxContent:string = '';
  inflowSummary:string = '';
  initialAcreFeet:string = '';
  errors: any = [];
  fileName: string = "";
  reportId: string = "";
  //dirName: string = "D:\\Taylor River\\2024-reports\\";
  //dirName: string = "file:///D:/Taylor River/2024-reports/";
  dirName: string = "";
  fileNamePattern = /^[0-9a-zA-Z-]+$/;

  maxFileSize: number = 1000000000;

  operations: string[] = [];
  proposedOperations: any = '';

  elevationGridData: any = '';
  elevationGridOptions: any = '';

  calendarVisible           = false;
  clearOperationDataVisible = false;
  dataDialogVisible         = false;
  elevationVisible          = false;
  errorInputVisible         = false;
  saveDialogVisible         = false;
  importFileDialogVisible   = false;
  operationsHelpSidebarVisible  = false
  loadDataHelpSidebarVisible = false
  fileImportHelpSidebarVisible = false;
  saveDataHelpSidebarVisible = false;

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

  checkNameCharacter(event:any) {

    if ( (this.fileName.length > 0) && ( (this.fileName[0] === "-") ||  (!this.fileName[(this.fileName.length-1)].match(this.fileNamePattern)) ) ) {
      this.fileName = this.fileName.substring(0, (this.fileName.length-1));
    }

    if ( ( this.fileName[(this.fileName.length-1)] === "-" ) && ( this.fileName[(this.fileName.length-2)] === "-") ) {
      this.fileName = this.fileName.substring(0, (this.fileName.length-1));
    }
  }

  showSaveDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showSaveDataDialog -------- ' +
        this.saveDialogVisible
    );

    this.saveDialogVisible = !this.saveDialogVisible;
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

  showImportFileDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showImportFileDialog --------'
    );

    this.importFileDialogVisible = !this.importFileDialogVisible;
  }

  clearOperationalData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.clearOperationalData --------'
    );

    this.startingEOMContent   = 0.0;
    this.yearTypeInflow       = 0.0;
    this.eomContentLabel      = '';
    this.elevationGridData    = {};
    this.elevationGridOptions = '';
    this.yearTypeLabel        = '';
    this.yearTypeBackground   = '';
    this.proposedOperations   = '';
         
    this.reportName           = '';
    this.reportYear           = '';
    this.reportDay            = '';
    this.reportMonth          = '';
    
    this.forcastDate          = '';
    this.forcastPercent       = '';
    this.forcastAcreFeet      = '';
    
    this.maxContent           = '';
    this.inflowSummary        = '';
    this.initialAcreFeet      = '';

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

  // //fileDrop = (event : DragEvent) => {
  // fileDrop = () => {
  //   console.log('--- file drop ---');
  //   //console.log(event);
  // }
  // dragStart = (event: DragEvent) => {
  //   console.log('--- dragStart ---');
  //   //console.log(event);
  // }
  // dragEnd = (event: DragEvent) => {
  //   console.log('--- dragEnd ---');
  //   //console.log(event);
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

  saveOperationalJson (element: any): any {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.saveOperationalJson --------'
    );
    
    let myElementJson: any = {};

    Object.keys( element )


    for ( let i = 0; i < (Object.keys( element )).length; i++ ) {
      
      myElementJson[Object.keys( element )[i]] = element[Object.keys( element )[i]];
    }
    //console.log(myElementJson);
    return myElementJson;
  }

  readOperationalData(event: FileUploadEvent) {
    let myReadJson:any = {};

    let reader = new FileReader;
    let fileLines:any = "";

    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.readOperationalData --------'
    );

    reader.readAsText(event.files[0]);

    reader.onload = () => {

      fileLines = reader.result;

      this.clearOperationalData();
      
      if (fileLines.length > 0 ) {
        myReadJson = JSON.parse(fileLines);
  
         this.operationMonthlyData = myReadJson.data;
         
         this.startingEOMContent   = myReadJson.startingEOMContent;
         this.yearTypeInflow       = myReadJson.yearTypeInflow;
         this.eomContentLabel      = myReadJson.eomContentLabel;
         this.elevationGridData    = myReadJson.elevationGridData;
         this.elevationGridOptions = myReadJson.elevationGridOptions;
         this.yearTypeLabel        = myReadJson.yearTypeLabel;
         this.yearTypeBackground   = myReadJson.yearTypeBackground;
         this.proposedOperations   = myReadJson.proposedOperations;
         
         this.reportName   = myReadJson.reportName;
         this.reportYear   = myReadJson.reportYear;
         this.reportDay   = myReadJson.reportName;
         this.reportMonth   = myReadJson.reportName;
         
         this.forcastDate   = myReadJson.forcastDate;
         this.forcastPercent   = myReadJson.forcastPercent;
         this.forcastAcreFeet   = myReadJson.forcastAcreFeet;
         
         this.maxContent   = myReadJson.maxContent;
         this.inflowSummary   = myReadJson.inflowSummary;
         this.initialAcreFeet   = myReadJson.initialAcreFeet;
  
        this.importFileDialogVisible = !this.importFileDialogVisible

      }
    };
  }

  saveOperationalData() {

    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.saveOperationalData -------- '
    );
    
    let myJson: any = { data:[] };

    if ( this.fileName[this.fileName.length-1] === "-" ) {
      this.fileName = this.fileName.substring(0, (this.fileName.length-1));
    }

    this.fileName =  this.dirName + this.fileName + ".txt";

    this.operationMonthlyData.forEach( (element: any) => myJson.data.push(this.saveOperationalJson( element ) ));
 
    myJson.startingEOMContent   = this.startingEOMContent;
    myJson.yearTypeInflow       = this.yearTypeInflow;
    myJson.eomContentLabel      = this.eomContentLabel;
    myJson.elevationGridData    = this.elevationGridData;
    myJson.elevationGridOptions = this.elevationGridOptions;
    myJson.yearTypeLabel        = this.yearTypeLabel;
    myJson.yearTypeBackground   = this.yearTypeBackground;
    myJson.proposedOperations   = this.proposedOperations;

    myJson.reportName           = this.reportName;
    myJson.reportYear           = this.reportYear;
    myJson.reportDay            = this.reportDay;
    myJson.reportMonth          = this.reportMonth;
    
    myJson.forcastDate          = this.forcastDate;
    myJson.forcastPercent       = this.forcastPercent;
    myJson.forcastAcreFeet      = this.forcastAcreFeet;
    
    myJson.maxContent           = this.maxContent;
    myJson.inflowSummary        = this.inflowSummary;
    myJson.initialAcreFeet      = this.initialAcreFeet;
    myJson.reportId             = this.reportId;

    //console.log(myJson);

    //This is what needs to be saved 
    let fileContent:string = JSON.stringify(myJson);

    const file = new Blob([fileContent], { type: "test/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = this.fileName;
    link.click();
    link.remove();

    //fileSaver(file, this.fileName);

    this.saveDialogVisible = !this.saveDialogVisible;
    this.showMessage('success', 'Success', 'File Saved in Downloads Folder', 3000);
  }

  showMessage(mySeverity:string, mySummary:string, myMessage:string, myLife:any) {
    //severity: info success warn error
      this.messageService.add({key: 'message', severity:mySeverity, summary: mySummary, detail: myMessage, life:myLife});
  }

  clearManualInputs() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.clearManualInputs -------- '
    );

    let myEomContent = this.startingEOMContent;
    let myInflow  = 0;
    let myOutflow = 0;
    let myIndex   = 0;
    this.recaculateYearType = 0.0;

    for (
      let i = myIndex;
      i < this.operationMonthlyData.length;
      i++
    ) {

      this.operationMonthlyData[i].manualInflowColor = "";
      this.operationMonthlyData[i].manualOutFlowColor = "";
      this.operationMonthlyData[i].manualInflow = null;
      this.operationMonthlyData[i].manualOutflow = null;
      myInflow  =  this.operationMonthlyData[i].inflow;
      myOutflow =  this.operationMonthlyData[i].outflow;

      if (i === 0) {
        myEomContent = this.startingEOMContent;
      } else {
        myEomContent = this.operationMonthlyData[i - 1].eomContent;
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

      //console.log(this.operations);

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
    // this.myLog.log(
    //   'INFO',
    //   '-------- OperationsDataComponent.getEOMContent -------- ' +
    //     baseContent +
    //     ' ' +
    //     inflow +
    //     ' ' +
    //     outflow
    // );

    return baseContent + inflow - outflow;
  }

  setEOMContent(baseContent: number, inflow: number, outflow: number): number {
    // this.myLog.log(
    //   'INFO',
    //   '-------- OperationsDataComponent.setEOMContent -------- ' +
    //     baseContent +
    //     ' ' +
    //     inflow +
    //     ' ' +
    //     outflow
    // );

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

    //console.log(inputData);
    
    let myEomContent = 0;
    let myInflow = Number(inputData.manualInflow);
    let myOutflow = Number(inputData.manualOutflow);
    let myIndex = Number(inputData.index);
    this.recaculateYearType = 0.0;
    //console.log( this.operationMonthlyData[Number(inputData.index)]);
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

  convertReportDate(reportDate:string): string {
    let myDate = reportDate.replaceAll(',','');
    
    let dateArray:any = myDate.split(" ");

    let myMonth:string = dateArray[0];
    
    this.reportYear = dateArray[2];
    this.reportDay =  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    
    switch (myMonth) {
      case "January": {
        myDate = dateArray[2] + "-01-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '01';
        break;
      }
      case "February": {
        myDate = dateArray[2] + "-02-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '02';
        break;
      }
      case "March": {
        myDate = dateArray[2] + "-03-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '03';
        break;
      }
      case "April": {
        myDate = dateArray[2] + "-04-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '04';
        break;
      }
      case "May": {
        myDate = dateArray[2] + "-05-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '05';
        break;
      }
      case "June": {
        myDate = dateArray[2] + "-06-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '06';
        break;
      }
      case "July": {
        myDate = dateArray[2] + "-07-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '07';
        break;
      }
      case "August": {
        myDate = dateArray[2] + "-08-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '08';
        break;
      }
      case "September": {
        myDate = dateArray[2] + "-09-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '09';
        break;
      }
      case "October": {
        myDate = dateArray[2] + "-10-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '10';
        break;
      }
      case "November": {
        myDate = dateArray[2] + "-11-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '11';
        break;
      }
      case "December": {
        myDate = dateArray[2] + "-12-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.reportMonth  = '12';
        break;
      }
      default : {
        myDate = dateArray[2] + "-" + dateArray[0] + "-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
      }
    }

    return myDate;
  }

  getOperationData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getOperationData --------'
    );

    this.startingEOMContent = 0.0;
    let temp: any = this.operationsService.getJson();
    this.errors = this.operationsService.getErrorsJson();

    //console.log(temp);

    if ( (temp.data) && (!this.errors.fatalError) ) {

      this.reportName = temp.name.replaceAll(' ','-');
      this.reportDate = temp.date;
      this.reportDate = this.convertReportDate(this.reportDate);

      let forcast:any = temp.forcast.split(" ");
      
      console.log("forcast length " + forcast.length);
      this.forcastDate = forcast[0] + " " + forcast[1] + " " + this.reportYear;

      if (forcast.length === 7) {
        this.forcastDate     = forcast[0] + " " + forcast[1] + " " + this.reportYear;
        this.forcastPercent  = forcast[4].replaceAll('%','');
        this.forcastAcreFeet = forcast[5].replaceAll('(','').replaceAll(')','').replaceAll(',','');

      } else {
        this.forcastDate     = forcast[0] + " " + this.reportYear;
        this.forcastPercent  = forcast[3].replaceAll('%','');
        this.forcastAcreFeet = forcast[4].replaceAll('(','').replaceAll(')','').replaceAll(',','');
      }

      this.initialAcreFeet = temp.initialAcreFeet.replaceAll(',','');

      let maxContent:any = temp.maxContent.split(" ");
      this.maxContent = maxContent[0].replaceAll(',','');
      
      let inflowSummary:any = temp.inflowSummary.split(" ");
      this.inflowSummary = inflowSummary[0].replaceAll(',','');

      this.fileName = this.reportDate + "-" + this.reportName.replaceAll(' ','-');
      this.reportId =  this.reportDate.replaceAll('-','');

      this.operationMonthlyData = temp.data;

      this.startingEOMContent = parseInt(temp.initialAcreFeet.replaceAll(',', ''));

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
