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

  selectedSize = "p-datatable-sm";
  myDate: Date = new Date();
  operationsData: any;
  operationMonthlyData: any = [];
  editMonthlyData: any = [];
  editDailyData: any = [];
  startingEOMContent: number = 0.0;
  eomContentLabel: string = '';
  yearTypeLabel: string = '';
  yearTypeBackground: string = '';
  yearTypeBackgroundAnalytics: string = '';
  reportName: string = '';
  reportDate:string = '';
  reportYear:string = '';
  reportDay:string = '';
  reportMonth:string = '';
  forcastDate:string    = '';
  forcastPercent:string  = '';
  forcastAcreFeet:string = '';
  maxContent:string = '';
  normal:string = '';
  inflowSummary:string = '';
  initialAcreFeet:string = '';
  errors: any = [];
  fileName: string = "";
  reportId: string = "";
  //dirName: string = "D:\\Taylor River\\2024-reports\\";
  //dirName: string = "file:///D:/Taylor River/2024-reports/";
  dirName: string = "";
  fileNamePattern = /^[0-9a-zA-Z-]+$/;

  outflowPercetage:number = 0;
  outflowDirection:string = "Decrease";

  maxFileSize: number = 1000000000;

  operations: string[] = [];
  proposedOperations: any = '';

  elevationGridData: any = '';
  elevationGridOptions: any = '';

  reportNameTitle:string = "";
  reportDateTitle:string = "";
  myReportHeader:string = "";

  overRideChecked:boolean = false;

  calendarVisible               = false;
  clearOperationDataVisible     = false;
  dataDialogVisible             = false;
  elevationVisible              = false;
  errorInputVisible             = false;
  editDialogVisible             = false;
  dailyDialogVisible            = false;
  linksVisible                  = false;
  saveDialogVisible             = false;
  importFileDialogVisible       = false;
  editHelpSidebarVisible        = false;
  operationsHelpSidebarVisible  = false
  loadDataHelpSidebarVisible    = false
  fileImportHelpSidebarVisible  = false;
  saveDataHelpSidebarVisible    = false;

  yearTypeInflow = 0.0;
  recaculateYearType = 0.0;

  reportMonths:any = [];
  modifiedReportMonths:any = [];
  myMonths = constants.MONTHS;
  selectedMonth:any = this.myMonths[0];
  dayIndex:number = 0;
  startingDailyEOMContent: number = 0.0;

  myLinks = [
    {"name" : "USGS - Water Data", "link" : "https://waterdata.usgs.gov/nwis/inventory?agency_code=USGS&site_no=09108500"},
    {"name" : "Bureau of Reclamation", "link" : "https://www.usbr.gov/projects/index.php?id=236"},
    {"name" : "Gunnison River Basin", "link" : "https://gunnisonriverbasin.org/water-management/taylor-park-reservoir-operations/"},
    {"name" : "snoflo Report", "link" : "https://snoflo.org/report/flow/colorado/taylor-river-below-taylor-park-reservoir/"},
    {"name" : "USGS Water Data", "link" : "https://waterdata.usgs.gov/monitoring-location/09110000"},
    {"name" : "State of Colorado", "link" : "https://dwr.state.co.us/Tools/Stations/TAYBERCO?params=DISCHRG&gridObservations-sort=meas_value-asc&gridAnalysisSummaryCY-sort=amt_aug-asc&gridPeakStreamFlow-sort=peak_q_date-asc&gridAnalysisSummaryIY-sort=amt_jan-asc&gridAnalysisSummaryWY-sort=amt_may-asce"},
    {"name" : "Taylor Park Dam - wikipedia", "link" : "https://en.wikipedia.org/wiki/Taylor_Park_Dam"}
  ]

  showEditDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showEditDialog -------- ' +
        this.editDialogVisible
    );

    // console.log('-----------------  operationMonthlyData  ---------------------');

    // console.log(this.operationMonthlyData);

    let myData:string = JSON.stringify(this.operationMonthlyData);

    // console.log('-----------------  myData  ---------------------');

    // console.log(myData);

    //const myData  = Object.assign([], this.operationMonthlyData);  //clone
    this.editMonthlyData = JSON.parse(myData);

    // console.log('-----------------  editMonthlyData  ---------------------');

    // console.log(this.editMonthlyData);

    this.editDialogVisible = !this.editDialogVisible;
    
    //TODO need to set the values on save so the values are the same.  think about the flow when 

    this.outflowPercetage = 0;
    this.outflowDirection = "Decrease";

  }

  showDailyDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showDailyDialog -------- ' +
        this.dailyDialogVisible
    );

    let myData:string = "";

    if (this.editMonthlyData.length == 0 ) {
      myData = JSON.stringify(this.operationMonthlyData);
      this.editMonthlyData = JSON.parse(myData);
    }

    this.dayIndex = this.getStartingMonthlyIndex(this.editMonthlyData);
    
    console.log("index " + this.dayIndex);
    console.log(this.editMonthlyData[this.dayIndex]);
    console.log(this.editMonthlyData[this.dayIndex].eomContent);

    console.log('Months EOM Content ' + this.editMonthlyData[this.dayIndex].eomContent);
    console.log('Next Months EOM Content ' + this.editMonthlyData[this.dayIndex+1].eomContent);

    if (this.dayIndex == 0) {
      this.startingDailyEOMContent = this.startingEOMContent
    } else {
      
      this.startingDailyEOMContent =  this.editMonthlyData[this.dayIndex-1].eomContent;
    }
    console.log('startingDailyEOMContent '  + this.startingDailyEOMContent);

    myData = JSON.stringify(this.editMonthlyData[this.dayIndex]);
    this.reportMonths[0] =  JSON.parse(myData);//this.editMonthlyData[this.dayIndex];
    

    myData = JSON.stringify(this.editMonthlyData[this.dayIndex+1]);
    this.reportMonths[1] = JSON.parse(myData);//this.editMonthlyData[(this.dayIndex+1)];

    let reportString:string =  JSON.stringify(this.editMonthlyData[(this.dayIndex+1)]);
    this.reportMonths[2] = JSON.parse(reportString);
    this.reportMonths[2].month = "Month Total";
    this.reportMonths[2].dateRange = "";
    this.reportMonths[2].days = this.reportMonths[0].days + this.reportMonths[1].days;
    this.reportMonths[2].inflow  = Number(this.editMonthlyData[this.dayIndex].inflow) + Number(this.editMonthlyData[this.dayIndex+1].inflow);
    this.reportMonths[2].outflow = Number(this.editMonthlyData[this.dayIndex].outflow) +  Number(this.editMonthlyData[this.dayIndex+1].outflow);
    this.reportMonths[2].eomContent = 0;
    this.reportMonths[2].eomElevation = 0;

    // console.log( this.reportMonths[0].inflow);
    // console.log( this.reportMonths[1].inflow);
    // console.log( this.reportMonths[2].inflow);

    this.modifiedReportMonths[0] = this.editMonthlyData[this.dayIndex];
    this.modifiedReportMonths[1] = this.editMonthlyData[(this.dayIndex+1)];
    this.modifiedReportMonths[2] = this.reportMonths[2];
    
    this.modifiedReportMonths[3] = JSON.parse(reportString);
    this.modifiedReportMonths[3].month = "Monthly Difference";
    this.modifiedReportMonths[3].days = this.reportMonths[0].days + this.reportMonths[1].days;
    this.modifiedReportMonths[3].dateRange = "";
    this.modifiedReportMonths[3].inflow  = 0;
    this.modifiedReportMonths[3].outflow = 0;
    this.modifiedReportMonths[3].eomContent = 0;
    this.modifiedReportMonths[3].eomElevation = 0;

    this. selectedMonth = this.getMonth(this.editMonthlyData[this.dayIndex].month); 
    console.log(this.modifiedReportMonths);

    //this.editDailyData[0]
    this.getDailyData(this.reportMonths[0],this.reportMonths[1]);

    this.dailyDialogVisible = !this.dailyDialogVisible;
  }

  changeDailyMonth(month:any) {
    console.log('--- changeDailyMonth ---');
    //console.log(month);
    
    let myMonth:string =  "" + this.convertMonthStringToNumber(month.month);

    this.dayIndex = this.getMonthIndex(this.editMonthlyData, myMonth);

    console.log(this.editMonthlyData);
    
    console.log("index " + this.dayIndex);
    //console.log(this.editMonthlyData[this.dayIndex]);
    console.log('Months EOM Content ' + this.editMonthlyData[this.dayIndex].eomContent);
    console.log('Next Months EOM Content ' + this.editMonthlyData[this.dayIndex+1].eomContent);

    if (this.dayIndex == 0) {
      this.startingDailyEOMContent = this.startingEOMContent
    } else {
      
      this.startingDailyEOMContent =  this.editMonthlyData[this.dayIndex-1].eomContent;
    }
    console.log('startingDailyEOMContent '  + this.startingDailyEOMContent);

    this.reportMonths[0] = this.editMonthlyData[this.dayIndex];
    this.reportMonths[1] = this.editMonthlyData[(this.dayIndex+1)];
    

    let reportString:string =  JSON.stringify(this.editMonthlyData[(this.dayIndex+1)]);
    this.reportMonths[2] = JSON.parse(reportString);
    this.reportMonths[2].month = "Monthly Total";
    this.reportMonths[2].days = this.reportMonths[0].days + this.reportMonths[1].days;
    this.reportMonths[2].dateRange = "";
    this.reportMonths[2].inflow  = Number(this.editMonthlyData[this.dayIndex].inflow) + Number(this.editMonthlyData[this.dayIndex+1].inflow);
    this.reportMonths[2].outflow = Number(this.editMonthlyData[this.dayIndex].outflow) +  Number(this.editMonthlyData[this.dayIndex+1].outflow);
    this.reportMonths[2].eomContent = 0;
    this.reportMonths[2].eomElevation = 0;
    
    console.log(this.reportMonths);

    this.modifiedReportMonths[0] = this.reportMonths[0];
    this.modifiedReportMonths[1] = this.reportMonths[1];
    this.modifiedReportMonths[2] = this.reportMonths[2];
    
    this.modifiedReportMonths[3] = JSON.parse(reportString);
    this.modifiedReportMonths[3].month = "Monthly Difference";
    this.modifiedReportMonths[3].days = this.reportMonths[0].days + this.reportMonths[1].days;
    this.modifiedReportMonths[3].dateRange = "";
    this.modifiedReportMonths[3].inflow  = (Number(this.modifiedReportMonths[0].inflow) + Number(this.modifiedReportMonths[1].inflow)) - (Number(this.reportMonths[0].inflow) + Number(this.reportMonths[1].inflow));
    this.modifiedReportMonths[3].outflow = (Number(this.modifiedReportMonths[0].outflow) + Number(this.modifiedReportMonths[1].outflow)) - (Number(this.reportMonths[0].outflow) + Number(this.reportMonths[1].outflow)); 
    this.modifiedReportMonths[3].eomContent = 0;
    this.modifiedReportMonths[3].eomElevation = 0; 

    console.log(this.modifiedReportMonths);

    let myDays:number =  this.editMonthlyData[this.dayIndex].days + this.editMonthlyData[this.dayIndex+1].days

    // console.log(myDays);
    // console.log(this.editMonthlyData[dayIndex].days);
    // console.log(this.editMonthlyData[dayIndex+1].days);

    this. selectedMonth = this.getMonth(this.editMonthlyData[this.dayIndex].month); 
    //console.log(this.reportMonths);
    
    this.getDailyData(this.editMonthlyData[this.dayIndex], this.editMonthlyData[this.dayIndex+1]);

  }

  getDailyData(myData1:any, myData2:any) {
    console.log('--- getDailyData ---');
    // console.log(myData1);
    // console.log(myData2);

    this.editDailyData = [];
    let totalInflow:number = 0;
    let totalOutflow:number = 0;
    let totalManualOutflow:number = 0;
    let totalDays:number = 0;
    let totalEomContent:number = this.startingDailyEOMContent;

    for (let i = 0; i < myData1.days; i++) {
      let myData = {"day":"", "avgInflowCFS":0, "avgOutflowCFS":0, "lastOutflowCFS":0, "manualOutflowCFS":0, "orgEomContent":0, "startEomContent":0, "eomContent":0, "eomElevation":0, "index":0, "manualOutFlowColor":"", "elevationWarning":"", "disabled":false};
      myData.day = myData1.month + "-" + (i+1);
      myData.avgInflowCFS = myData1.avgInflowCFS;
      myData.avgOutflowCFS = myData1.avgOutflowCFS;
      myData.lastOutflowCFS = myData1.avgOutflowCFS;
      myData.manualOutflowCFS = myData1.avgOutflowCFS.toFixed(5);
      totalEomContent = totalEomContent + this.elevationService.getAcreFeetFromCFS(myData.avgInflowCFS) - this.elevationService.getAcreFeetFromCFS(myData.manualOutflowCFS);
      myData.eomContent = totalEomContent;
      myData.orgEomContent = totalEomContent;
      myData.eomElevation = this.elevationService.getElevation(myData.eomContent);
      console.log("myData.eomElevation " + myData.eomElevation);
      myData.elevationWarning = this.getElevationWarning(myData.eomElevation);
      myData.index = (i+1);
      myData.manualOutFlowColor = "";
      totalInflow        = totalInflow + myData1.avgInflowCFS;
      totalOutflow       = totalOutflow + myData1.avgOutflowCFS;
      totalManualOutflow = totalManualOutflow + myData1.avgOutflowCFS;
      totalDays = totalDays + 1;
      this.editDailyData.push(myData);
    }

    for (let i = myData1.days; i < (myData1.days + myData2.days ); i++) {
      let myData = {"day":"", "avgInflowCFS":0, "avgOutflowCFS":0, "lastOutflowCFS":0, "manualOutflowCFS":0, "orgEomContent":0, "startEomContent":0, "eomContent":0, "eomElevation":0, "index":0, "manualOutFlowColor":"", "elevationWarning":"", "disabled":false};
      myData.day = myData2.month + "-" + (i+1);
      myData.avgInflowCFS = myData2.avgInflowCFS;
      myData.avgOutflowCFS = myData2.avgOutflowCFS;
      myData.lastOutflowCFS = myData2.avgOutflowCFS;
      myData.manualOutflowCFS = myData2.avgOutflowCFS.toFixed(5);
      totalEomContent = totalEomContent + this.elevationService.getAcreFeetFromCFS(myData.avgInflowCFS) - this.elevationService.getAcreFeetFromCFS(myData.manualOutflowCFS);
      myData.eomContent = totalEomContent;
      myData.orgEomContent = totalEomContent;
      myData.eomElevation = this.elevationService.getElevation(myData.eomContent);
      console.log("myData.eomElevation " + myData.eomElevation);
      myData.elevationWarning = this.getElevationWarning(myData.eomElevation);
      myData.index = (i+1);
      myData.manualOutFlowColor = "";
      totalInflow        = totalInflow + myData2.avgInflowCFS;
      totalOutflow       = totalOutflow + myData2.avgOutflowCFS;
      totalManualOutflow = totalManualOutflow + myData2.avgOutflowCFS;
      totalDays = totalDays + 1;

      this.editDailyData.push(myData);
    }      
    let myData = {"day":"Totals", "avgInflowCFS":totalInflow, "avgOutflowCFS":totalOutflow, "lastOutflowCFS":totalOutflow, "manualOutflowCFS":totalManualOutflow, "orgEomContent":0, "startEomContent":0, "eomContent":totalEomContent, "eomElevation":0, "index":totalDays, "manualOutFlowColor":"", "elevationWarning":"", "disabled":true};
    
    this.editDailyData.push(myData);

    console.log(this.editDailyData);

  }

  getNumber(myNumber:any): number {
    return Number(myNumber);
  }

  closeEditDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.closeEditDialog -------- ' +
        this.editDialogVisible
    );

    this.editDialogVisible = !this.editDialogVisible;
  }

  saveOperationalEditData(mySaveData:any) {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.saveOperationalEditData -------- '
    );

    let saveIndex = "0";

    //console.log(mySaveData);
    //console.log( this.operationMonthlyData);

    for (let i = 0; i < mySaveData.length; i++) {
      //console.log(mySaveData[i].manualInflow + " " + mySaveData[i].manualOutflow );
      //console.log(this.operationMonthlyData[i].manualInflow + " " + this.operationMonthlyData[i].manualOutflow );

      if (mySaveData[i].manualOutflow) {
        this.operationMonthlyData[i].manualOutflow = mySaveData[i].manualOutflow;
        this.operationMonthlyData[i].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
      }

      if (mySaveData[i].manualInflow) { 

        this.operationMonthlyData[i].manualInflow  = mySaveData[i].manualInflow;
        this.operationMonthlyData[i].manualInFlowColor = constants.CELL_CHANGE_COLOR;
      }

    }

    this.recalculateEOM(this.operationMonthlyData,saveIndex);

    this.addToGridElevation()

    this.editDialogVisible = !this.editDialogVisible;
  }

  showClearOperationalDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.showClearOperationalDataDialog -------- ' +
        this.clearOperationDataVisible
    );

    this.clearOperationDataVisible = !this.clearOperationDataVisible;
  }

  getMonth(myMonth:string):any {
    //console.log('getMonth ' + myMonth);
    for (let i = 0; i < this.myMonths.length; i++) {
      if (myMonth === this.myMonths[i].abrev) {
        return this.myMonths[i];
      }
    }
    return this.myMonths[0];
  }

  getMonthIndex(myData:any, myMonth:string):number {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getMonthIndex -------- ');
  
    let myIndex:number = 0;

    //console.log(myData);

    // console.log(myData);
    // console.log(myMonth);

    for (let i = 0; i < myData.length; i++) {
     //console.log(myData[i].month + " " + this.convertMonthStringToNumber(myData[i].month) );
     if (Number(myMonth) === this.convertMonthStringToNumber(myData[i].month) ) {
      myIndex = i;
      //console.log('-----------------------------------');
      break;
     }

    }

    //console.log('Starting index ' + myIndex);

    return myIndex;

  }

    getStartingMonthlyIndex(myData:any):number {
      this.myLog.log(
        'INFO',
        '-------- OperationsDataComponent.getMaxWaterLevelIndex -------- ');
    
      let myIndex:number = 0;
  
      //console.log(myData);

      // console.log(myData);
      // console.log(this.reportMonth);
  
      for (let i = 0; i < myData.length; i++) {
       //console.log(myData[i].month + " " + this.convertMonthStringToNumber(myData[i].month) );
       if (Number(this.reportMonth) === this.convertMonthStringToNumber(myData[i].month) ) {
        myIndex = i;
        //console.log('-----------------------------------');
        break;
       }
  
      }

    //console.log('Starting index ' + myIndex);

    return myIndex;
    
  }

  getMaxWaterLevelIndex(myData:any):number {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getMaxWaterLevelIndex -------- ');
  
    let myIndex:number = 0;
    let myEOMElevation = 0;

    for (let i = 0; i < myData.length; i++) {
     //console.log(myData[i].month + " " + this.convertMonthStringToNumber(myData[i].month) );
     if (Number(myData[i].eomElevation) > myEOMElevation ) {
      myIndex = i;
      myEOMElevation = Number(myData[i].eomElevation);
      //console.log('-----------------------------------');
     }

    }

    return myIndex;
    
  }

  getMinWaterLevelIndex(myData:any):number {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getMinWaterLevelIndex -------- ');
  
    let myIndex:number = 0;
    let myEOMElevation = 11000;

    for (let i = 0; i < myData.length; i++) {
     //console.log(myData[i].month + " " + this.convertMonthStringToNumber(myData[i].month) );
     if (Number(myData[i].eomElevation) < myEOMElevation ) {
      myIndex = i;
      myEOMElevation = Number(myData[i].eomElevation);
      //console.log('-----------------------------------');
     }

    }

    return myIndex;
    
  }

  clearManualOutflow(myData:any) {
    for (let i = 0; i < myData.length; i++) {
      myData[i].manualOutflow = "";
      myData[i].manualOutFlowColor = "";
    }
  }

  override(myData:any) {
    if (!this.overRideChecked) {
      this.clearManualOutflow(myData);
      this.recalculateEOM( myData, "0");
    }
    
    this.onPercentageChange(myData);

  }
  
  onPercentageChange(myData:any) {
    //console.log('--- OperationsDataComponent.onPercentageChange --- ');
    //console.log("outflowPercetage " + this.outflowPercetage);
    //console.log("outflowDirection " + this.outflowDirection);
    //console.log("reportMonth      " + Number(this.reportMonth));

    let myIndex:number = 0;

    myIndex = this.getStartingMonthlyIndex(myData);

    if ( this.overRideChecked ) {
      myIndex = 0;
    }

    for (let i = myIndex; i < myData.length; i++) {
      if (this.outflowDirection === "Increase") {
        //console.log("myOutflow = "  + myData[i].outflow + " " + (myData[i].outflow + myData[i].outflow * (this.outflowPercetage / 100) ));
        
        //console.log(myData[i]);
        myData[i].manualOutflow = (myData[i].outflow + myData[i].outflow * (this.outflowPercetage / 100)).toFixed(2);

        
        if ( myData[i].manualOutflow > 0) {
            
          myData[i].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
        }
    
      } else if (this.outflowDirection === "Decrease") {
        //console.log(myData[i]);
        //console.log("myOutflow = "  + myData[i].outflow + " " + (myData[i].outflow - myData[i].outflow * (this.outflowPercetage / 100) ));
        
        myData[i].manualOutflow = (myData[i].outflow - myData[i].outflow * (this.outflowPercetage / 100)).toFixed(2);
          
        if ( myData[i].manualOutflow > 0) {
            
          myData[i].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
        }
    
      }

    }

    this.recalculateEOM( myData, myIndex.toString());

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
    this.yearTypeBackgroundAnalytics = '';
    this.proposedOperations   = '';
    
    this.reportNameTitle      = '';
    this.reportDateTitle      = '';
    this.myReportHeader       = '';
         
    this.reportName           = '';
    this.reportYear           = '';
    this.reportDay            = '';
    this.reportMonth          = '';
    
    this.forcastDate          = '';
    this.forcastPercent       = '';
    this.forcastAcreFeet      = '';
    
    this.normal               = '';
    this.maxContent           = '';
    this.inflowSummary        = '';
    this.initialAcreFeet      = '';

    this.operationsService.clearOperationalData();
    this.operationMonthlyData = [];
    this.editMonthlyData      = [];
    this.editDailyData        = [];
    this.reportMonths         = [];
    this.modifiedReportMonths = [];
    this.selectedMonth = this.myMonths[0];
    this.dayIndex = 0;
    this.clearOperationDataVisible = false;
    this.errors = [];

    this.outflowPercetage = 0;
    this.outflowDirection = "Decrease";

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
    this.yearTypeBackgroundAnalytics = '';

    if (this.yearTypeInflow < constants.DRY_YEAR.low) {
      this.yearTypeLabel = constants.DRY_YEAR_LABEL;
      this.yearTypeBackground = constants.DRY_YEAR_BACKGROUND;
      this.yearTypeBackgroundAnalytics = constants.DRY_YEAR_BACKGROUND_ANALYTICS;
    } else if (this.yearTypeInflow < constants.WET_YEAR.low) {
      this.yearTypeLabel = constants.AVG_YEAR_LABEL;
      this.yearTypeBackground = constants.AVG_YEAR_BACKGROUND;
      this.yearTypeBackgroundAnalytics = constants.AVG_YEAR_BACKGROUND_ANALYTICS;
    } else {
      this.yearTypeLabel = constants.WET_YEAR_LABEL;
      this.yearTypeBackground = constants.WET_YEAR_BACKGROUND;
      this.yearTypeBackgroundAnalytics = constants.WET_YEAR_BACKGROUND_ANALYTICS;
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

      //console.log(JSON.parse(fileLines));
      
      if (fileLines.length > 0 ) {
        myReadJson = JSON.parse(fileLines);

        //console.log(myReadJson);
  
         this.operationMonthlyData = myReadJson.data;
         
         this.startingEOMContent   = myReadJson.startingEOMContent;
         this.yearTypeInflow       = myReadJson.yearTypeInflow;
         this.eomContentLabel      = myReadJson.eomContentLabel;
         this.elevationGridData    = myReadJson.elevationGridData;
         this.elevationGridOptions = myReadJson.elevationGridOptions;
         this.yearTypeLabel        = myReadJson.yearTypeLabel;
         this.yearTypeBackground   = myReadJson.yearTypeBackground;
         
         this.yearTypeBackgroundAnalytics = myReadJson.yearTypeBackgroundAnalytics;
         this.proposedOperations   = myReadJson.proposedOperations;
         
        this.reportNameTitle       = myReadJson.reportNameTitle;
        this.reportDateTitle       = myReadJson.reportDateTitle;
        this.myReportHeader        = myReadJson.reportNameTitle + " - " + myReadJson.reportDateTitle

         this.reportName   = myReadJson.reportName;
         this.reportYear   = myReadJson.reportYear;
         this.reportDay   = myReadJson.reportDay;
         this.reportMonth   = myReadJson.reportMonth;
         
         this.forcastDate   = myReadJson.forcastDate;
         this.forcastPercent   = myReadJson.forcastPercent;
         this.forcastAcreFeet   = myReadJson.forcastAcreFeet;
         
         
         this.normal               = myReadJson.normal;
         this.maxContent   = myReadJson.maxContent;
         this.inflowSummary   = myReadJson.inflowSummary;
         this.initialAcreFeet   = myReadJson.initialAcreFeet;
  
        this.importFileDialogVisible = !this.importFileDialogVisible

        this.fileName = this.reportYear + "-" + this.reportMonth + "-" + this.reportDay + "-" + this.reportName.replaceAll(' ','-') + "-edited";

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
    myJson.yearTypeBackgroundAnalytics = this.yearTypeBackgroundAnalytics;
    myJson.proposedOperations   = this.proposedOperations;
         
    myJson.reportNameTitle      = this.reportNameTitle;
    myJson.reportDateTitle      = this.reportDateTitle;

    myJson.reportName           = this.reportName;
    myJson.reportYear           = this.reportYear;
    myJson.reportDay            = this.reportDay;
    myJson.reportMonth          = this.reportMonth;
    
    myJson.forcastDate          = this.forcastDate;
    myJson.forcastPercent       = this.forcastPercent;
    myJson.forcastAcreFeet      = this.forcastAcreFeet;
    
    myJson.normal               = this.normal;
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

  clearManualEditInputs(myClearEditData:any) {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.clearManualEditInputs -------- '
    );


    let myEomContent = this.startingEOMContent;
    let myInflow  = 0;
    let myOutflow = 0;
    let myIndex   = 0;
    //this.recaculateYearType = 0.0;
    
    this. outflowPercetage = 0;
    this.outflowDirection = "Decrease";

    for (
      let i = myIndex;
      i < myClearEditData.length;
      i++
    ) {

      myClearEditData[i].manualInflowColor = "";
      myClearEditData[i].manualOutFlowColor = "";
      myClearEditData[i].manualInflow = null;
      myClearEditData[i].manualOutflow = null;
      myInflow  =  myClearEditData[i].inflow;
      myOutflow =  myClearEditData[i].outflow;

      if (i === 0) {
        myEomContent = this.startingEOMContent;
      } else {
        myEomContent = myClearEditData[i - 1].eomContent;
      }

      myClearEditData[i].eomContent =
        myEomContent + myInflow - myOutflow;

      myClearEditData[i].eomElevation =
        this.elevationService.getElevation(
          myClearEditData[i].eomContent
        );

      myClearEditData[i].elevationWarning = this.getElevationWarning(
        myClearEditData[i].eomElevation
      );
    }

    //this.addToGridElevation();

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

    this.elevationGridData.datasets[4] = elevationAdjustedData;
  }

  getElevationGridData() {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getElevationGridData --------'
    );

    let myTempMaxLabel     = constants.MAX_LABEL     + " (" + constants.MAX_ELEVATION_LEVEL + ")";
    let myTempWarningLabel = constants.WARNING_LABEL + " (" + constants.WARNING_ELEVATION_LEVEL + ")";

    // console.log(myTempMaxLabel);
    // console.log(myTempWarningLabel);

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
      myTempWarningLabel +
      '"}';
    let myMaxLevel =
      '{"data":[],"backgroundColor":"' +
      constants.MAX_GRID_BACKGROUND +
      '","borderDash": [5, 5],"fill":false,"borderColor":"' +
      constants.MAX_GRID_LINECOLOR +
      '","tension":".4","label":"' +
      myTempMaxLabel +
      '"}';
      let myDateLine =
        '{"data":[],"backgroundColor":"' +
        constants.DATE_GRID_BACKGROUND +
        '","fill":false,"borderColor":"' +
        constants.DATE_GRID_LINECOLOR +
        '","tension":".4","label":"' +
        constants.DATE_LABEL +
        '"}';

    let myProposedData: any = [];
    let myInflowData: any = [];
    let myOutflowData: any = [];
    let myDateLineData: any = [];
    let myLabels: any = [];
    let myWarning: any = [];
    let myMax: any = [];

    this.elevationGridData = JSON.parse(myJSONstring);
    let elevationProposedData = JSON.parse(myProposedLevel);
    let outFlowData = JSON.parse(myOutFlowLevel);
    let inFlowData = JSON.parse(myInFlowLevel);
    let elevationWarningData = JSON.parse(myWarningLevel);
    let elevationMaxData = JSON.parse(myMaxLevel);
    let elevationDateData = JSON.parse(myDateLine);

    //console.log(this.operationMonthlyData);

    let dayIndex:number = this.getStartingMonthlyIndex(this.operationMonthlyData);
    let maxIndex:number = this.getMaxWaterLevelIndex(this.operationMonthlyData);
    let minIndex:number = this.getMinWaterLevelIndex(this.operationMonthlyData);

    //console.log("Day Index: " + dayIndex + " " +  this.operationMonthlyData[dayIndex].month + " " +  this.operationMonthlyData[dayIndex].dateRange);
    //console.log("Min Index: " + minIndex + " " +  this.operationMonthlyData[minIndex].eomElevation);
    //console.log("Max Index: " + maxIndex + " " +  this.operationMonthlyData[maxIndex].eomElevation);

    myDateLineData[dayIndex] =  (this.operationMonthlyData[minIndex].eomElevation - 3);

    //console.log(myDateLineData);

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

    //this.elevationGridGeader = this.elevationGridGeader + ;

    elevationProposedData.data = myProposedData;
    inFlowData.data = myInflowData;
    outFlowData.data = myOutflowData;
    elevationWarningData.data = myWarning;
    elevationMaxData.data = myMax;
    elevationDateData.data = myDateLineData;

    this.elevationGridData.datasets[0] = elevationWarningData;
    this.elevationGridData.datasets[1] = elevationMaxData;
    this.elevationGridData.datasets[2] = elevationProposedData;
    this.elevationGridData.datasets[3] = elevationDateData;
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

      this.myReportHeader = this.operations[1] + " - " + this.operations[3];

      //console.log(this.myReportHeader);


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
    console.log("return warning elevation " + elevation + " warning [" + warning + "]");
    return warning;
  }

  recalculateDaily(myDailyData: any, myIndex:string) {

    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.recalculateDaily -------- ' +
      myIndex
    );

    console.log(myDailyData);
    console.log('myIndex ' + myIndex);
    let index = Number(myIndex) - 1;
    console.log('index ' + index);
    let cfsDifference = Number(myDailyData[index].manualOutflowCFS) -  Number(myDailyData[index].lastOutflowCFS);
    let eomDifference = this.elevationService.getAcreFeetFromCFS(cfsDifference);
    console.log("eomDifference " + eomDifference );
    
    // console.log('index ' + index);
    // console.log(myDailyData[index]);
    // console.log('man ' + myDailyData[index].avgOutflowCFS);
    // console.log('avg ' + myDailyData[index].manualOutflowCFS);
    // console.log('dif ' + cfsDifference);


    let totalManualOutflow:number = 0;

    for (let i = index; i < (myDailyData.length-1); i++) {
      console.log("before " + myDailyData[i].eomContent + " " + myDailyData[i].eomElevation + " [" + myDailyData.elevationWarning + "]");
      myDailyData[i].eomContent =  myDailyData[i].eomContent - eomDifference;
      myDailyData[i].eomElevation = this.elevationService.getElevation( myDailyData[i].eomContent);
      //console.log("myData.eomElevation " + myDailyData.eomElevation);
      myDailyData[i].elevationWarning = this.getElevationWarning(myDailyData[i].eomElevation);
      console.log("recalculated " + myDailyData[i].eomContent + " " + myDailyData[i].eomElevation  + " [" + myDailyData.elevationWarning + "]");
      // add in elevation here
    }

    for (let i = 0; i < (myDailyData.length-1); i++) {
      //console.log(myDailyData[i]);
      //console.log(myDailyData[i].day + " " +  myDailyData[i].index + " " + myDailyData[i].manualOutflowCFS );
      totalManualOutflow = totalManualOutflow + Number(myDailyData[i].manualOutflowCFS);
    }
    // console.log(myDailyData.length);
    // console.log(myDailyData[(myDailyData.length-1)]);
    myDailyData[(myDailyData.length-1)].manualOutflowCFS = totalManualOutflow;
    myDailyData[index].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
    

    // console.log(this.elevationService.getAcreFeetFromCFS(totalManualOutflow)); 
    // console.log(this.elevationService.getAcreFeetFromCFS(cfsDifference));

    //todo change the summary

    if (index < 16) {
      console.log(this.modifiedReportMonths[0]);
      this.modifiedReportMonths[0].outflow =   this.modifiedReportMonths[0].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);
      this.editMonthlyData[this.dayIndex].manualOutflow = this.modifiedReportMonths[0].outflow;
      this.editMonthlyData[this.dayIndex].manualOutFlowColor = constants.CELL_CHANGE_COLOR;

    } else {
      
      console.log(this.modifiedReportMonths[1]);
      this.modifiedReportMonths[1].outflow =   this.modifiedReportMonths[1].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);
      this.editMonthlyData[(this.dayIndex+1)].manualOutflow = this.modifiedReportMonths[1].outflow;
      this.editMonthlyData[(this.dayIndex+1)].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
    }

    this.modifiedReportMonths[2].outflow = this.modifiedReportMonths[2].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);
    this.modifiedReportMonths[3].outflow = this.modifiedReportMonths[3].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);

    console.log(this.modifiedReportMonths);

    myDailyData[index].lastOutflowCFS = myDailyData[index].manualOutflowCFS;

    this.recalculateEOM(this.editMonthlyData, ("" + this.dayIndex));

  }

  recalculateEOM(myRecalcData: any, myIndex:string) {

    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.recalculateEOM -------- ' +
      myIndex
    );

    //console.log(inputData);
    
    let myEomContent = 0;
    let index = Number(myIndex);
    let myInflow = Number(myRecalcData[index].manualInflow);
    let myOutflow = Number(myRecalcData[index].manualOutflow);
    this.recaculateYearType = 0.0;
    //console.log( this.operationMonthlyData[Number(myRecalcData[index].index)]);
    myRecalcData[index].manualInflowColor = "";
    myRecalcData[index].manualOutFlowColor = "";

    if  ( (myRecalcData[index].manualInflow) && (myRecalcData[index].manualInflow > 0) ) {
      //myRecalcData[index].manualInflow = myInflow;
      myRecalcData[index].manualInflowColor = constants.CELL_CHANGE_COLOR;
    }
    if ((myRecalcData[index].manualOutflow) && (myRecalcData[index].manualOutflow > 0) ) {
      //myRecalcData[index].manualOutflow = myOutflow;
      myRecalcData[index].manualOutFlowColor = constants.CELL_CHANGE_COLOR;
    }

    for (
      let i = index;
      i < myRecalcData.length;
      i++
    ) {

      if (i === 0) {
        myEomContent = this.startingEOMContent;
      } else {
        myEomContent = myRecalcData[i - 1].eomContent;
      }

      if (!myOutflow) {
        myOutflow = 0;
      }

      if (!myInflow) {
        myInflow = 0;
      }

      if ( (!myRecalcData[i].manualInflow) || (Number(myRecalcData[i].manualInflow) === 0) ) {
        myInflow = Number(myRecalcData[i].inflow);
      } else {
        myInflow = Number(myRecalcData[i].manualInflow);
      }

      if ( (!myRecalcData[i].manualOutflow) || (myRecalcData[i].manualOutflow === 0)) {
        myOutflow = myRecalcData[i].outflow;
      } else {
        myOutflow = Number(myRecalcData[i].manualOutflow);
      }

      myRecalcData[i].eomContent =
        myEomContent + myInflow - myOutflow;

      myRecalcData[i].eomElevation =
        this.elevationService.getElevation(
          myRecalcData[i].eomContent
        );

      myRecalcData[i].elevationWarning = this.getElevationWarning(
        myRecalcData[i].eomElevation
      );
    }

    //this.addToGridElevation();  //TODO add when saving the data.
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

  convertStringToNumber(myNumberString:string): number {

    return Number(myNumberString);

  }

  convertMonthStringToNumber(myMonthString:string): number {

    let month:number = 0;

    let myMonth:string = "";

    //console.log("convertMonthStringToNumber " + myMonthString);

    if (myMonthString) {

      myMonth = myMonthString.toLowerCase();

    }

    //console.log(myMonth);

    switch (myMonth) {
      case "january": {
        month  = 1;
        break;
      }
      case "february": {
        month  = 2;
        break;
      }
      case "march": {
        month  = 3;
        break;
      }
      case "april": {
        month  = 4;
        break;
      }
      case "may": {
        month  = 5;
        break;
      }
      case "june": {
        month  = 6;
        break;
      }
      case "july": {
        month  = 7;
        break;
      }
      case "august": {
        month  = 8;
        break;
      }
      case "september": {
        month  = 9;
        break;
      }
      case "october": {
        month  = 10;
        break;
      }
      case "november": {
        month  = 11;
        break;
      }
      case "december": {
        month  = 12;
        break;
      }
      case "jan": {
        month  = 1;
        break;
      }
      case "feb": {
        month  = 2;
        break;
      }
      case "mar": {
        month  = 3;
        break;
      }
      case "apr": {
        month  = 4;
        break;
      }
      // case "may": {   -- above --
      //   month  = 5;
      //   break;
      // }
      case "jun": {
        month  = 6;
        break;
      }
      case "jul": {
        month  = 7;
        break;
      }
      case "aug": {
        month  = 8;
        break;
      }
      case "sep": {
        month  = 9;
        break;
      }
      case "oct": {
        month  = 10;
        break;
      }
      case "nov": {
        month  = 11;
        break;
      }
      case "dec": {
        month  = 12;
        break;
      }
      default : {
        month  = 0;
      }
    }
    
    //console.log(month);
    return month;
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

    this.myReportHeader   = temp.reportNameTitle + " - " + temp.reportDateTitle

    this.reportNameTitle = temp.name;
    this.reportDateTitle = temp.date;

    if ( (temp.data) && (!this.errors.fatalError) ) {

      this.reportName = temp.name.replaceAll(' ','-');
      this.reportDate = temp.date;

      this.reportDate = this.convertReportDate(this.reportDate);

      let forcast:any = temp.forcast.split(" ");
      
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

      let normal:any =  temp.normal.split(" ");
      this.normal =  normal[0];

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
    // console.log('-------------- getOperationData -------------------');
    // console.log(this.operationMonthlyData);

    // console.log('-------------- getOperationData stringify -------------------');
    // console.log(JSON.stringify(this.operationMonthlyData));

    this.myReportHeader = this.reportNameTitle + " - " + this.reportDateTitle;

  }

  openPDF(pdf:any){
    window.open(pdf);
    return false;
  }
}
