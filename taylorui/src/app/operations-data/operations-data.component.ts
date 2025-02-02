import { Inject, Injectable, Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { interval, Subscription, take, Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ElevationService } from '../elevation.service';
import { LoggingService } from '../logging.service';
import { OperationsService } from '../operations.service';

import { Report }  from '../../modules/report.module';
import { Monthly } from '../../modules/report.module';
import { Daily }   from '../../modules/report.module';

import * as constants from '../../constants';
import { FileUploadEvent } from 'primeng/fileupload';

import {parse, stringify, toJSON, fromJSON} from 'flatted';


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

  
  myReport:Report                     = new Report();
  selectedSize                        = "p-datatable-sm";
  myChangedText                       = constants.CELL_CHANGE_COLOR_TEXT;
  myDate: Date                        = new Date();
  editMonthlyData: Monthly[]          = [];
  editDailyData: Daily[]              = [];  
  reportTotals: Monthly[]             = [];
  modifiedReportTotals: Monthly[]     = [];
  dailyData:any                       = [];  //TODO change type to daily  All days - dailyData
  
  yearTypeBackgroundAnalytics: string = '';

  errors: any                         = [];
  fileName: string                    = "";
  dirName: string                     = "";
  fileNamePattern                     = /^[0-9a-zA-Z-]+$/;

  outflowPercentage:number            = 0;
  outflowDirection:string             = "Decrease";

  maxFileSize: number                 = 1000000000;

  operations: string[]                = [];
  proposedOperations: any             = '';

  elevationGridData: any              = '';
  elevationGridOptions: any           = '';

  myTabIndex:number                  = 0;

  overRideChecked:boolean            = false;

  calendarVisible                    = false;
  clearOperationDataVisible          = false;
  dataDialogVisible                  = false;
  elevationVisible                   = false;
  errorInputVisible                  = false;
  editDialogVisible                  = false;
  dailyDialogVisible                 = false;
  linksVisible                       = false;
  saveDialogVisible                  = false;
  importFileDialogVisible            = false;
  editHelpSidebarVisible             = false;
  operationsHelpSidebarVisible       = false;
  loadDataHelpSidebarVisible         = false;
  fileImportHelpSidebarVisible       = false;
  saveDataHelpSidebarVisible         = false;
  unDockMonths                       = false;

  rollupChange:boolean               = false;

  recaculateYearType                 = 0.0;

  myMonths = constants.MONTHS;
  selectedMonth:any                  = this.myMonths[0];
  monthIndex:number                  = 0;
  startingDailyEOMContent: number    = 0.0;

  monthlyStats:any = {
    "maxInflow":0,
    "maxInflowDate":"",
    "minInflow":100000,
    "minInflowDate":"",
    "maxEOMContent":0,
    "maxEOMContentDate":"",
    "minEOMContent":100000,
    "minEOMContentDate":"",
    "maxElevation":0,
    "maxElevationtDate":"",
    "minElevationContent":100000,
    "minElevationContentDate":"",
    "maxAvgInflow":0,
    "maxAvgInflowDate":"",
    "minAvgInflow":100000,
    "minAvgInflowDate":"",
    "totalInflow":100000,
    "totalOutflow":0
  };

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
      '-------- Operations-Data-Component.showEditDialog -------- ' +
        this.editDialogVisible
    );

    this.editMonthlyData = this.operationsService.getEditMonthlyData();
    this.editDialogVisible = !this.editDialogVisible;
    
    //TODO NOt sure what this is .... need to set the values on save so the values are the same.  think about the flow when 

    this.outflowPercentage = 0;
    this.outflowDirection = "Decrease";

  }

  getTabMonthIndex(myMonth:any):any {

    let myTabMonthIndex:string =  myMonth.month.toLowerCase();
    let myTab = 0;
    
    switch (myTabMonthIndex) {
      case "november": {
        myTab  = 0;
        break;
      }
      case "december": {
        myTab  = 1;
        break;
      }
      case "january": {
        myTab = 2;
        break;
      }
      case "february": {
        myTab  = 3;
        break;
      }
      case "march": {
        myTab  = 4;
        break;
      }
      case "april": {
        myTab  = 5;
        break;
      }
      case "may": {
        myTab  = 6;
        break;
      }
      case "june": {
        myTab  = 7;
        break;
      }
      case "july": {
        myTab  = 8;
        break;
      }
      case "august": {
        myTab  = 9;
        break;
      }
      case "september": {
        myTab  = 10;
        break;
      }
      case "october": {
        myTab  = 11;
        break;
      }
      default : {
        myTab  = 0;
      }
    }

    return myTab;
  }

 changeTabMonth(event:any) {
  // console.log("--- changeTabMonth ---");
  // console.log(event.index);

  // console.log("--- myMonth ---");
  // console.log(myMonth);

  this.changeDailyMonth(this.myMonths[event.index]);
  
 }

  showDailyDialog() {
    console.log("--- showDailyDialog ---");
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.showDailyDialog -------- ' +
        this.dailyDialogVisible
    );

    let myData:string = "";

    if (this.editMonthlyData.length == 0 ) {
      myData = JSON.stringify(this.myReport.monthly);
      this.editMonthlyData = JSON.parse(myData);
    }

    this.monthIndex = this.getStartingMonthlyIndex(this.editMonthlyData);

    this.selectedMonth = this.getMonth(this.editMonthlyData[this.monthIndex].month); 

    let myMonthIndex:number = this.getDailyIndex(this.dailyData, this.selectedMonth.abrev);

    this.myTabIndex = this.getTabMonthIndex(this.selectedMonth);

    this.editDailyData = this.dailyData[Number(myMonthIndex)];  //TODO does this need cloned

    for ( let i = 0; i < this.editDailyData.length; i++) {
      this.editDailyData[i].elevationWarning = this.getElevationWarning(
        this.editDailyData[i].eomElevation
      );
    }

    if (this.monthIndex == 0) {
      this.startingDailyEOMContent = this.myReport.startingEOMContent; 
    } else {
      
      this.startingDailyEOMContent =  this.editMonthlyData[this.monthIndex-1].startingEOMContent;
    }
    
    this.reportTotals[0] = this.operationsService.deepClone(this.editMonthlyData[this.monthIndex]);
    
    if (this.reportTotals[0].manualInflow != 0) {
      this.reportTotals[0].inflow = this.reportTotals[0].manualInflow;
    }
    if (this.reportTotals[0].manualOutflow != 0) {
      this.reportTotals[0].outflow = this.reportTotals[0].manualOutflow;
    }

    this.reportTotals[1] = this.operationsService.deepClone(this.editMonthlyData[this.monthIndex+1]); 

    if (this.reportTotals[1].manualInflow != 0) {
      this.reportTotals[1].inflow = this.reportTotals[1].manualInflow;
    }
    if (this.reportTotals[1].manualOutflow != 0) {
      this.reportTotals[1].outflow = this.reportTotals[1].manualOutflow;
    }
    
    this.reportTotals[2] = this.operationsService.deepClone(this.editMonthlyData[(this.monthIndex+1)]); 
    this.reportTotals[2].month = "Month Total";
    this.reportTotals[2].dateRange = "";
    this.reportTotals[2].days = this.reportTotals[0].days + this.reportTotals[1].days;
    this.reportTotals[2].inflow  = Number(this.reportTotals[0].inflow) + Number(this.reportTotals[1].inflow);
    this.reportTotals[2].outflow = Number(this.reportTotals[0].outflow) +  Number(this.reportTotals[1].outflow);
    this.reportTotals[2].originalOutflow = this.reportTotals[2].outflow;
    this.reportTotals[2].manualInflow = 0;
    this.reportTotals[2].manualOutflow = 0;
    this.reportTotals[2].eomContent = 0;
    this.reportTotals[2].originalEomContent = 0;
    this.reportTotals[2].eomElevation = 0;
    this.reportTotals[2].elevationWarning = '';
    
    // this.modifiedReportTotals[0] = this.operationsService.deepClone(this.editMonthlyData[this.monthIndex]);
    // this.modifiedReportTotals[1] = this.operationsService.deepClone(this.editMonthlyData[this.monthIndex+1]);

    this.modifiedReportTotals[0] = this.operationsService.deepClone(this.reportTotals[0]);
    this.modifiedReportTotals[1] = this.operationsService.deepClone(this.reportTotals[1]);
    this.modifiedReportTotals[2] = this.operationsService.deepClone(this.reportTotals[2]);
    
    this.modifiedReportTotals[3]                  = this.operationsService.deepClone( this.editMonthlyData[(this.monthIndex+1)]);
    this.modifiedReportTotals[3].month            = "Monthly Difference";
    this.modifiedReportTotals[3].days             = this.reportTotals[0].days + this.reportTotals[1].days;
    this.modifiedReportTotals[3].dateRange        = "";
    this.modifiedReportTotals[3].inflow           = 0;
    this.modifiedReportTotals[3].originalOutflow  = 0;
    this.modifiedReportTotals[3].outflow          = 0;
    this.modifiedReportTotals[3].eomContent       = 0;
    this.modifiedReportTotals[3].eomElevation     = 0;
    this.modifiedReportTotals[3].elevationWarning = ''; 

    this.dailyDialogVisible = !this.dailyDialogVisible;
  }

  changeDailyMonth(month:any) {
    console.log('--- changeDailyMonth ---');
    
    let myMonth:string = "" + this.convertMonthStringToNumber(month.month);

    this.monthIndex = this.getMonthIndex(this.editMonthlyData, myMonth);
    let myMonthIndex:number = this.getDailyIndex(this.dailyData, month.abrev);

    this.selectedMonth = this.getMonth(this.editMonthlyData[this.monthIndex].month); 

    if (this.monthIndex == 0) {
      this.startingDailyEOMContent = this.myReport.startingEOMContent; //this.startingEOMContent
    } else {
      
      this.startingDailyEOMContent =  this.editMonthlyData[this.monthIndex-1].eomContent;
    }
    this.reportTotals[0] = this.operationsService.deepClone(this.editMonthlyData[this.monthIndex]);
    this.reportTotals[1] = this.operationsService.deepClone(this.editMonthlyData[(this.monthIndex+1)]);

    this.reportTotals[2] = this.operationsService.deepClone(this.editMonthlyData[(this.monthIndex+1)]);
    this.reportTotals[2].days = this.reportTotals[0].days + this.reportTotals[1].days;
    this.reportTotals[2].dateRange = "";
    this.reportTotals[2].inflow  = Number(this.reportTotals[0].inflow) + Number(this.reportTotals[1].inflow);
    this.reportTotals[2].manualInflow = 0;
    this.reportTotals[2].manualOutflow = 0;
    this.reportTotals[2].outflow = Number(this.reportTotals[0].outflow) +  Number(this.reportTotals[1].outflow);
    this.reportTotals[2].originalOutflow = this.reportTotals[2].outflow;
    this.reportTotals[2].eomContent = 0;
    this.reportTotals[2].originalEomContent = this.reportTotals[2].eomContent;
    this.reportTotals[2].eomElevation = 0;

    this.modifiedReportTotals[0] = this.operationsService.deepClone(this.reportTotals[0]);  
    this.modifiedReportTotals[1] = this.operationsService.deepClone(this.reportTotals[1]);
    this.modifiedReportTotals[2] = this.operationsService.deepClone(this.reportTotals[2]);
    
    this.modifiedReportTotals[3]                    = this.operationsService.deepClone(this.editMonthlyData[(this.monthIndex+1)]);
    this.modifiedReportTotals[3].month              = "Monthly Difference";
    this.modifiedReportTotals[3].days               = this.reportTotals[0].days + this.reportTotals[1].days;
    this.modifiedReportTotals[3].dateRange          = "";
    this.modifiedReportTotals[3].inflow             = (Number(this.modifiedReportTotals[0].inflow) + Number(this.modifiedReportTotals[1].inflow)) - (Number(this.reportTotals[0].inflow) + Number(this.reportTotals[1].inflow));
    this.modifiedReportTotals[3].outflow            = (Number(this.modifiedReportTotals[0].outflow) + Number(this.modifiedReportTotals[1].outflow)) - (Number(this.reportTotals[0].outflow) + Number(this.reportTotals[1].outflow)); 
    this.modifiedReportTotals[3].originalOutflow    = this.modifiedReportTotals[3].outflow;
    this.modifiedReportTotals[3].eomContent         = 0;
    this.modifiedReportTotals[3].originalEomContent = this.modifiedReportTotals[3].eomContent;
    this.modifiedReportTotals[3].eomElevation       = 0; 

    let myDays:number =  this.editMonthlyData[this.monthIndex].days + this.editMonthlyData[this.monthIndex+1].days;

    this.editDailyData = this.dailyData[myMonthIndex];

    for ( let i = 0; i < this.editDailyData.length; i++) {
      this.editDailyData[i].elevationWarning = this.getElevationWarning(
        this.editDailyData[i].eomElevation
      );
    }

  }

  changeDailyFromMonthly(myData:any) {
    console.log('--- changeDailyFromMonthly --- ');

    let myDays:number          = myData.days;
    let myStartDay:number      = Number(myData.dateRange.split("-")[0]);
    let isCalculated1:boolean  = false;
    let isCalculated2:boolean  = false;

    let myMonth                = myData.month;

    let myInflow:number        = 0;
    let myOutflow:number       = 0;

    let myInflowAFDay:number   = 0;
    let myOutflowAFDay:number  = 0;

    let myInflowCFS:number     = 0;
    let myOutflowCFS:number    = 0;

    let myMonthIndex:number    = this.getDailyIndex(this.dailyData, myMonth);

    if ( myStartDay < 16 ) {

      let myEomContent:number = Number(this.dailyData[myMonthIndex][0].startingEomContent);

      for (let i = 0; i < (this.dailyData[myMonthIndex].length -1); i++) {
        
        if (!isCalculated1) {

          // console.log('--- calculating first half of month ---');

          isCalculated1 = true;

          if (myData.manualInflow) {
            myInflow      = Number(myData.manualInflow);
            myInflowCFS   = this.elevationService.getAvgCubicFeetPerSecond(myInflow, myDays);
            myInflowAFDay = this.elevationService.getAcreFeetFromCFS(myInflowCFS);
          } else {
            myInflow      = Number(myData.inflow);
            myInflowCFS   = Number(myData.avgInflowCFS); 
            myInflowAFDay = this.elevationService.getAcreFeetFromCFS(myInflowCFS);
          }
      
          if ( myData.manualOutflow) {
            myOutflow      = Number(myData.manualOutflow);
            myOutflowCFS   = this.elevationService.getAvgCubicFeetPerSecond(myOutflow, myDays);
            myOutflowAFDay = this.elevationService.getAcreFeetFromCFS(myOutflowCFS);
          } else {
            myOutflow      = Number(myData.outflow);
            myOutflowCFS   = Number(myData.avgOutflowCFS); 
            myOutflowAFDay = this.elevationService.getAcreFeetFromCFS(myOutflowCFS);
          }

          // console.log('myEomContent ' + myEomContent);
      
          // console.log('avgInflowCFS  ' + myData.avgInflowCFS +  ' avgOutflowCFS  ' + myData.avgOutflowCFS);
          // console.log('myInflow      ' + myInflow +             ' myOutflow      ' + myOutflow);
          // console.log('myInflowCFS   ' + myInflowCFS +          ' myOutflowCFS   ' + myOutflowCFS);
          // console.log('myInflowAFDay ' + myInflowAFDay +        ' myOutflowAFDay ' + myOutflowAFDay); 
        }

        myEomContent = myEomContent + myInflowAFDay - myOutflowAFDay;
        // console.log('i ' + i + ' day ' +  this.dailyData[myMonthIndex][i].day + ' eom ' + myEomContent);

        this.dailyData[myMonthIndex][i].eomContent = myEomContent;
        this.dailyData[myMonthIndex][i].eomElevation = this.elevationService.getElevation(this.dailyData[myMonthIndex][i].eomContent);

        if ( (myData.manualInflow) && (i < 15) ) {  
          this.dailyData[myMonthIndex][i].manualInflowCFS       = myInflowCFS;
          this.dailyData[myMonthIndex][i].manualInflowColor     = constants.CELL_CHANGE_COLOR;
          this.dailyData[myMonthIndex][i].manualInflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
        } 
        
        if ( (myData.manualOutflow) && (i < 15) )  {  
          this.dailyData[myMonthIndex][i].manualOutflowCFS       = myOutflowCFS;
          this.dailyData[myMonthIndex][i].lastOutflowCFS         = myOutflowCFS;
          this.dailyData[myMonthIndex][i].lastRolledUpCFS        = myOutflowCFS;
          this.dailyData[myMonthIndex][i].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
          this.dailyData[myMonthIndex][i].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
        }
       

        if (i == 14) {

          // console.log('--- calculating second half of month ---');
          // console.log('-------------------------------------------------');
          // console.log(this.dailyData[myMonthIndex][i]);
          // console.log('-------------------------------------------------');
          //Calculate the second part of the month

          if (!isCalculated2) {

            isCalculated2 = true;

            //values have already been calculated

            myInflow      = Number(this.dailyData[myMonthIndex][i+1].manualInflow);
            myInflowCFS   = Number(this.dailyData[myMonthIndex][i+1].manualInflowCFS);
            myInflowAFDay = this.elevationService.getAcreFeetFromCFS(myInflowCFS);
            
            myOutflow      = Number(this.dailyData[myMonthIndex][i+1].manualOutflow);
            myOutflowCFS   = Number(this.dailyData[myMonthIndex][i+1].manualOutflowCFS);
            myOutflowAFDay = this.elevationService.getAcreFeetFromCFS(myOutflowCFS);

            // console.log('myEomContent ' + myEomContent);
    
            // console.log('avgInflowCFS  ' + myData.avgInflowCFS +  ' avgOutflowCFS  ' + myData.avgOutflowCFS);
            // console.log('myInflow      ' + myInflow +             ' myOutflow      ' + myOutflow);
            // console.log('myInflowCFS   ' + myInflowCFS +          ' myOutflowCFS   ' + myOutflowCFS);
            // console.log('myInflowAFDay ' + myInflowAFDay +        ' myOutflowAFDay ' + myOutflowAFDay); 

          }

        }

      }
    } else {

      let myEomContent:number = Number(this.dailyData[myMonthIndex][14].eomContent);
  
      // console.log('myEomContent ' + myEomContent);

      for (let i = 15; i < (this.dailyData[myMonthIndex].length -1); i++) {
        if (!isCalculated2) {

          // console.log('--- calculating second half of month only ---');

          isCalculated2 = true;

          if ( myData.manualInflow) {
            myInflow      = Number(myData.manualInflow);
            myInflowCFS   = this.elevationService.getAvgCubicFeetPerSecond(myInflow, myDays);
            myInflowAFDay = this.elevationService.getAcreFeetFromCFS(myInflowCFS);
          } else {
            myInflow      = Number(myData.inflow);
            myInflowCFS   = Number(myData.avgInflowCFS); 
            myInflowAFDay = this.elevationService.getAcreFeetFromCFS(myInflowCFS);
          }
      
          if ( myData.manualOutflow) {
            myOutflow      = Number(myData.manualOutflow);
            myOutflowCFS   = this.elevationService.getAvgCubicFeetPerSecond(myOutflow, myDays);
            myOutflowAFDay = this.elevationService.getAcreFeetFromCFS(myOutflowCFS);
          } else {
            myOutflow      = Number(myData.outflow);
            myOutflowCFS   = Number(myData.avgOutflowCFS); 
            myOutflowAFDay = this.elevationService.getAcreFeetFromCFS(myOutflowCFS);
          }

          // console.log('myEomContent ' + myEomContent);
      
          // console.log('avgInflowCFS  ' + myData.avgInflowCFS +  ' avgOutflowCFS  ' + myData.avgOutflowCFS);
          // console.log('myInflow      ' + myInflow +             ' myOutflow      ' + myOutflow);
          // console.log('myInflowCFS   ' + myInflowCFS +          ' myOutflowCFS   ' + myOutflowCFS);
          // console.log('myInflowAFDay ' + myInflowAFDay +        ' myOutflowAFDay ' + myOutflowAFDay); 
        }

        myEomContent = myEomContent + myInflowAFDay - myOutflowAFDay;
        // console.log('i ' + i + ' day ' +  this.dailyData[myMonthIndex][i].day + ' eom ' + myEomContent);

        this.dailyData[myMonthIndex][i].eomContent = myEomContent;
        this.dailyData[myMonthIndex][i].eomElevation = this.elevationService.getElevation(this.dailyData[myMonthIndex][i].eomContent);

        if ( myData.manualInflow )  {  
          this.dailyData[myMonthIndex][i].manualInflowCFS       = myInflowCFS;
          this.dailyData[myMonthIndex][i].manualInflowColor     = constants.CELL_CHANGE_COLOR;
          this.dailyData[myMonthIndex][i].manualInflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
        } 
        
        if ( myData.manualOutflow )  {  
          this.dailyData[myMonthIndex][i].manualOutflowCFS       = myOutflowCFS;
          this.dailyData[myMonthIndex][i].lastOutflowCFS         = myOutflowCFS;
          this.dailyData[myMonthIndex][i].lastRolledUpCFS        = myOutflowCFS;
          this.dailyData[myMonthIndex][i].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
          this.dailyData[myMonthIndex][i].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
        }
      }
    }
  }

  getAbsValue(myNumber:number):number {

    myNumber = Number(myNumber);
    if (isNaN(myNumber) || myNumber === null) {
      // console.log(" is not a number = " + myNumber);
      return 0;
    } else {
      // console.log('******** getAbsValue  type ' + typeof(myNumber) + " number '" + myNumber + "' abs " + Math.abs(myNumber));
      return Math.abs(myNumber);
    }
   
  }

  getNumber(myNumber:any): number {
    return Number(myNumber);
  }

  closeEditDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.closeEditDialog -------- ' +
        this.editDialogVisible
    );

    this.editDialogVisible = !this.editDialogVisible;
  }

  incorporateMonthlyData(mySaveData:any) {
    // console.log('--- incorporateMonthlyData ---');
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.incorporateMonthlyData -------- '
    );

    let saveIndex:number = 0;

    for (let i = 0; i < mySaveData.length; i++) {

      if (mySaveData[i].manualOutflow) {

        this.myReport.monthly[i].manualOutflow            = Number((mySaveData[i].manualOutflow).toFixed(3));
        this.myReport.monthly[i].outflowCF                = this.elevationService.getCubicFeet(this.myReport.monthly[i].manualOutflow);
        this.myReport.monthly[i].avgOutflowCFS            = this.elevationService.getCFSfromAFPerDay( (this.myReport.monthly[i].manualOutflow / this.myReport.monthly[i].days) );
        this.myReport.monthly[i].manualOutflowColor       = constants.CELL_CHANGE_COLOR;
        this.myReport.monthly[i].manualOutflowTextColor   = constants.CELL_CHANGE_COLOR_TEXT;
        // console.log("--- Out - myReport " + i +  " this.myReport.monthly[i].manualOutflow " + this.myReport.monthly[i].manualOutflow +  " manualOutflowColor " + this.myReport.monthly[i].manualOutflowColor +  " manualOutflowTextColor " + this.myReport.monthly[i].manualOutflowTextColor);

      }

      if (mySaveData[i].manualInflow) { 
        
        this.myReport.monthly[i].manualInflow            = Number((mySaveData[i].manualInflow).toFixed(3));
        this.myReport.monthly[i].inflowCF                = this.elevationService.getCubicFeet(this.myReport.monthly[i].manualInflow);
        this.myReport.monthly[i].avgInflowCFS            = this.elevationService.getCFSfromAFPerDay( (this.myReport.monthly[i].manualInflow / this.myReport.monthly[i].days) );
        this.myReport.monthly[i].manualInflowColor       = constants.CELL_CHANGE_COLOR;
        this.myReport.monthly[i].manualInflowTextColor   = constants.CELL_CHANGE_COLOR_TEXT;
        // console.log("--- In  - myReport " + i +  " manualOutflow " + this.myReport.monthly[i].manualOutflow  +  " manualInflowColor " + this.myReport.monthly[i].manualInflowColor  +  " manualInflowTextColor " + this.myReport.monthly[i].manualInflowTextColor);

      }

    }

    this.recalculateEOM( this.myReport.monthly,saveIndex);

    this.addToGridElevation()

    this.editDialogVisible = !this.editDialogVisible;

    // console.log('--- incorporate this.myReport ---');
    // console.log(this.myReport);
  }

  showClearOperationalDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.showClearOperationalDataDialog -------- ' +
        this.clearOperationDataVisible
    );

    this.clearOperationDataVisible = !this.clearOperationDataVisible;
  }

  getMonth(myMonth:string):any {
    // console.log('getMonth ' + myMonth);
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
      '-------- Operations-Data-Component.getMonthIndex -------- ');
  
    let myIndex:number = 0;

    for (let i = 0; i < myData.length; i++) {
     // console.log(myData[i].month + " " + this.convertMonthStringToNumber(myData[i].month) );
     if (Number(myMonth) === this.convertMonthStringToNumber(myData[i].month) ) {
      myIndex = i;
      // console.log('-----------------------------------');
      break;
     }

    }

    // console.log('Starting index ' + myIndex);

    return myIndex;

  }

  getDailyIndex(myData:any, myMonth:string):number {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getDailyIndex -------- ');
      // console.log("--- getDailyIndex ---");
  
  
    let myIndex:number = 0;

    for (let i = 0; i < myData.length; i++) {
      
         if (myMonth === myData[i][0].day.substring(0,3))  {
          myIndex = i;
          // console.log('---------------- inner loop -------------------');
          break;
         }
    }

    return myIndex;

  }

    getStartingMonthlyIndex(myData:any):number {
      this.myLog.log(
        'INFO',
        '-------- Operations-Data-Component.getMaxWaterLevelIndex -------- ');
    
      let myIndex:number = 0;
  
      for (let i = 0; i < myData.length; i++) {
        
       if (Number(this.myReport.reportMonth) === this.convertMonthStringToNumber(myData[i].month) ) {
        myIndex = i;
        
        break;
       }
  
      }

    return myIndex;
    
  }

  getMaxWaterLevelIndex(myData:any):number {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getMaxWaterLevelIndex -------- ');
  
    let myIndex:number = 0;
    let myEOMElevation = 0;

    for (let i = 0; i < myData.length; i++) {
     if (Number(myData[i].eomElevation) > myEOMElevation ) {
      myIndex = i;
      myEOMElevation = Number(myData[i].eomElevation);
     }

    }

    return myIndex;
    
  }

  getMinWaterLevelIndex(myData:any):number {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getMinWaterLevelIndex -------- ');
  
    let myIndex:number = 0;
    let myEOMElevation = 11000;

    for (let i = 0; i < myData.length; i++) {
     if (Number(myData[i].eomElevation) < myEOMElevation ) {
      myIndex = i;
      myEOMElevation = Number(myData[i].eomElevation);
     }

    }

    return myIndex;
    
  }

  clearManualOutflow(myData:any) {
    for (let i = 0; i < myData.length; i++) {
      myData[i].manualOutflow          = "";
      myData[i].manualOutflowColor     = "";
      myData[i].manualOutflowTextColor = "";
    }
  }

  override(myData:any) {
    if (!this.overRideChecked) {
      this.clearManualOutflow(myData);
      this.recalculateEOM( myData, 0);
    }
    
    this.onPercentageChange(myData);

  }
  
  onPercentageChange(myData:any) {

    let myIndex:number = 0;

    myIndex = this.getStartingMonthlyIndex(myData);

    if ( this.overRideChecked ) {
      myIndex = 0;
    }

    for (let i = myIndex; i < myData.length; i++) {
      if (this.outflowDirection === "Increase") {

        myData[i].manualOutflow = (myData[i].outflow + myData[i].outflow * (this.outflowPercentage / 100)).toFixed(3); 
        
        if ( myData[i].manualOutflow > 0) {
            
          myData[i].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
          myData[i].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
        }
        
        this.changeDailyFromMonthly(myData[i]);
    
      } else if (this.outflowDirection === "Decrease") {
        
        myData[i].manualOutflow = (myData[i].outflow - myData[i].outflow * (this.outflowPercentage / 100)).toFixed(3);
          
        if ( myData[i].manualOutflow > 0) {
            
          myData[i].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
          myData[i].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
        }
        
        this.changeDailyFromMonthly(myData[i]);
    
      }

    }

    this.recalculateEOM( myData, myIndex);

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
      '-------- Operations-Data-Component.showSaveDataDialog -------- ' +
        this.saveDialogVisible
    );

    this.saveDialogVisible = !this.saveDialogVisible;
  }

  closeClearOperationalDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.closeClearOperationalDataDialog -------- '
    );

    this.clearOperationDataVisible = false;
  }

  closeErrorInputDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.closeErrorInputDialog -------- '
    );

    this.errorInputVisible = false;
  }

  showDataDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.showDataDialog --------'
    );

    this.dataDialogVisible = !this.dataDialogVisible;
  }

  showImportFileDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.showImportFileDialog --------'
    );

    this.importFileDialogVisible = !this.importFileDialogVisible;
  }

  clearOperationalData() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.clearOperationalData --------'
    );
    this.elevationGridData    = {};
    this.elevationGridOptions = '';
    this.yearTypeBackgroundAnalytics = '';
    this.proposedOperations   = '';

    this.operationsService.clearOperationalData();

    this.myReport             = new Report();
    this.editMonthlyData      = [];  
    this.editDailyData        = [];
    this.dailyData            = [];
    this.reportTotals         = [];
    this.modifiedReportTotals = [];
    this.selectedMonth = this.myMonths[0];
    this.myTabIndex = 0;
    this.monthIndex = 0;
    this.clearOperationDataVisible = false;
    this.editDialogVisible         = false;
    this.dailyDialogVisible        = false;
    this.errors = [];

    this.rollupChange = false;

    this.outflowPercentage = 0;
    this.outflowDirection = "Decrease";
    
    this.monthlyStats = {
      "maxInflow":0,
      "maxInflowDate":"",
      "minInflow":0,
      "minInflowDate":"",
      "maxEOMContent":0,
      "maxEOMContentDate":"",
      "minEOMContent":0,
      "minEOMContentDate":"",
      "maxElevation":0,
      "maxElevationtDate":"",
      "minElevationContent":0,
      "minElevationContentDate":"",
      "maxAvgInflow":0,
      "maxAvgInflowDate":"",
      "minAvgInflow":0,
      "minAvgInflowDate":"",
      "totalInflow":0,
      "totalOutflow":0
    };

  }

  showElevationDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.showElevationDialog --------'
    );

    this.elevationVisible = !this.elevationVisible;
  }

  showErrorInputDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.errorInputVisible --------'
    );

    this.errorInputVisible = !this.errorInputVisible;
  }

  showCalendarDialog() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.showCalendarDialog --------'
    );
    this.calendarVisible = !this.calendarVisible;
  }

  handleKeyUpEvent = (event: any, column: string, index: string) => {  //TODO this is not used
    this.myLog.log('INFO', '***** handleEvent ******');
    let myIndex = Number(index);
    let myKey = '';

    if (myIndex < this.myReport.monthly.length && myIndex > -1) {
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

  calculateMonthlyStats(myData:any) {

    this.monthlyStats.maxInflow = 0;
    this.monthlyStats.maxInflowDate = "";
    this.monthlyStats.minInflow = 100000;
    this.monthlyStats.minInflowDate = "";
    this.monthlyStats.maxEOMContent = 0;
    this.monthlyStats.maxEOMContentDate = "";
    this.monthlyStats.minEOMContent = 100000;
    this.monthlyStats.minEOMContentDate = "";
    this.monthlyStats.maxElevation = 0;
    this.monthlyStats.maxElevationtDate = "";
    this.monthlyStats.minElevationContent = 100000;
    this.monthlyStats.minElevationContentDate = "";
    this.monthlyStats.maxAvgInflow = 0;
    this.monthlyStats.maxAvgInflowDate = "";
    this.monthlyStats.minAvgInflow = 100000;
    this.monthlyStats.minAvgInflowDate = "";
    this.monthlyStats.totalInflow = 100000;
    this.monthlyStats.totalOutflow = 0;

    for ( let i = 0; i < myData.length; i++ ) {
      
      if (myData[i].inflow > this.monthlyStats.maxInflow) {
        this.monthlyStats.maxInflow     = myData[i].inflow;
        this.monthlyStats.maxInflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].inflow < this.monthlyStats.minInflow) {
        this.monthlyStats.minInflow     = myData[i].inflow;
        this.monthlyStats.minInflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].outflow > this.monthlyStats.maxOutflow) {
        this.monthlyStats.maxOutflow     = myData[i].outflow;
        this.monthlyStats.maxOutflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].outflow < this.monthlyStats.minOutflow) {
        this.monthlyStats.maxOutflow     = myData[i].outflow;
        this.monthlyStats.minOutflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].avgInflowCFS > this.monthlyStats.maxAvgInflow) {
        this.monthlyStats.maxAvgInflow     = myData[i].avgInflowCFS;
        this.monthlyStats.maxAvgInflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].avgInflowCFS < this.monthlyStats.minAvgInflow) {
        this.monthlyStats.minAvgInflow     = myData[i].avgInflowCFS;
        this.monthlyStats.minAvgInflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].avgOutflowCFS < this.monthlyStats.minAvgInflow) {
        this.monthlyStats.avgOutflowCFS     = myData[i].avgOutflowCFS;
        this.monthlyStats.minAvgOutflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].avgOutflowCFS < this.monthlyStats.minAvgOutflow) {
        this.monthlyStats.minAvgOutflow     = myData[i].avgOutflowCFS;
        this.monthlyStats.minAvgOutflowDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].eomContent > this.monthlyStats.maxEOMContent) {
        this.monthlyStats.maxEOMContent     = myData[i].eomContent;
        this.monthlyStats.maxEOMContentDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].eomContent < this.monthlyStats.minEOMContent) {
        this.monthlyStats.minEOMContent     = myData[i].eomContent;
        this.monthlyStats.minEOMContentDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].eomElevation > this.monthlyStats.maxElevation) {
        this.monthlyStats.maxElevation      = myData[i].eomElevation;
        this.monthlyStats.maxElevationtDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      if (myData[i].eomElevation < this.monthlyStats.minElevationContent) {
        this.monthlyStats.minElevationContent     = myData[i].eomElevation;
        this.monthlyStats.minElevationContentDate = myData[i].month + ' ' +  myData[i].dateRange;
      }

      this.monthlyStats.totalInflow  = this.monthlyStats.totalInflow + myData[i].inflow;
      this.monthlyStats.totalOutflow = this.monthlyStats.totalOutflow + myData[i].outflow;

    }
    
  }

  setYearType() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.setYearType --------'
    );

    
    this.myReport.yearTypeBackground = '';
    this.yearTypeBackgroundAnalytics = '';

    if (this.myReport.yearTypeInflow < constants.DRY_YEAR.high) {

      this.myReport.yearTypeLabel      = constants.DRY_YEAR_LABEL;
      this.myReport.yearTypeBackground = constants.DRY_YEAR_BACKGROUND;
      this.yearTypeBackgroundAnalytics = constants.DRY_YEAR_BACKGROUND_ANALYTICS;

    } else if (this.myReport.yearTypeInflow < constants.AVG_YEAR.high) {

      this.myReport.yearTypeLabel      = constants.AVG_YEAR_LABEL;
      this.myReport.yearTypeBackground = constants.AVG_YEAR_BACKGROUND;
      this.yearTypeBackgroundAnalytics = constants.AVG_YEAR_BACKGROUND_ANALYTICS;

    } else {

      this.myReport.yearTypeLabel      = constants.WET_YEAR_LABEL;
      this.myReport.yearTypeBackground = constants.WET_YEAR_BACKGROUND;
      this.yearTypeBackgroundAnalytics = constants.WET_YEAR_BACKGROUND_ANALYTICS;
    }
  }

  saveArrayToObjectsJson (element: any): any {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.saveArrayToObjectsJson --------'
    );
    
    let myElementJson: any = {};

    Object.keys( element );

    for ( let i = 0; i < (Object.keys( element )).length; i++ ) {
      
      myElementJson[Object.keys( element )[i]] = element[Object.keys( element )[i]];
    }
    return myElementJson;
  }

  // loadDailyData(loadData:Daily[]): Daily[] {  //TODO this is not used
  //   // console.log('--- loadDailyData ---');
  //   let myLoadDailyData:any = [];

  //   for ( let i = 0; i < loadData.length; i++ ) {
  //     let myDailyJsonData:string = JSON.stringify(loadData[i]);
  //     myLoadDailyData[i] = JSON.parse(myDailyJsonData);
  //   }

  //   return myLoadDailyData;

  // }

  readOperationalData(event: FileUploadEvent) {
    console.log('--- readOperationalData ---');
    let myReadJson:any = {};

    let reader = new FileReader;
    let fileLines:any = "";

    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.readOperationalData --------'
    );

    reader.readAsText(event.files[0]);

    reader.onload = () => {

      fileLines = reader.result;

      this.clearOperationalData();
      
      if (fileLines.length > 0 ) {
        myReadJson = JSON.parse(fileLines);

         this.myReport = myReadJson.report;

         this.operationsService.setMyReport(this.myReport);

         this.editMonthlyData = this.operationsService.getEditMonthlyData();

         this.dailyData = this.operationsService.getDailyData();
         
         this.elevationGridData    = myReadJson.elevationGridData;
         this.elevationGridOptions = myReadJson.elevationGridOptions;
         
         this.yearTypeBackgroundAnalytics = myReadJson.yearTypeBackgroundAnalytics;
         this.proposedOperations   = myReadJson.proposedOperations;
  
        this.importFileDialogVisible = !this.importFileDialogVisible

        this.fileName = this.myReport.reportYear + "-" + this.myReport.reportMonth + "-" + this.myReport.reportDay + "-" + this.myReport.reportName.replaceAll(' ','-') + "-edited";

      }
    }
  }

  saveOperationalData() {

    console.log('--- saveOperationalData ---');
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.saveOperationalData -------- '
    );
    
    let myReport: any                  = { "report":{"daily":[], "reportMonths":[]} };
    let myReportMonthlyJson: any       = { "monthly":[] };
    let myDailyJson: any               = { "dailyData":[] };
    let mySaveAllOperationalData: any  = [];

    if ( this.fileName[this.fileName.length-1] === "-" ) {
      this.fileName = this.fileName.substring(0, (this.fileName.length-1));
    }

    if (this.fileName.includes(".txt")) {
      const index = this.fileName.indexOf(".txt");
      this.fileName = this.fileName.substring(0, index);
    }

    this.fileName =  this.dirName + this.fileName + ".txt"; 

    myReport.elevationGridData                  = this.elevationGridData;
    myReport.elevationGridOptions               = this.elevationGridOptions;
    myReport.proposedOperations                 = this.proposedOperations;

    myReport.report.startingEOMContent          = this.myReport.startingEOMContent;
    myReport.report.yearTypeInflow              = this.myReport.yearTypeInflow;
    myReport.report.eomContentLabel             = this.myReport.eomContentLabel;
    myReport.report.yearTypeLabel               = this.myReport.yearTypeLabel;
    myReport.report.yearTypeBackground          = this.myReport.yearTypeBackground;
    myReport.report.yearTypeBackgroundAnalytics = this.yearTypeBackgroundAnalytics; //TODO how do I handle this.  Analytics object
         
    myReport.report.reportNameTitle             = this.myReport.reportNameTitle;
    myReport.report.reportDateTitle             = this.myReport.reportDateTitle;

    myReport.report.reportName                  = this.myReport.reportName;
    myReport.report.reportYear                  = this.myReport.reportYear;
    myReport.report.reportDay                   = this.myReport.reportDay;
    myReport.report.reportMonth                 = this.myReport.reportMonth;
    
    myReport.report.forecastDate                = this.myReport.forecastDate;
    myReport.report.forecastPercent             = this.myReport.forecastPercent;
    myReport.report.forecastAcreFeet            = this.myReport.forecastAcreFeet;
    
    myReport.report.normal                      = this.myReport.normal;
    myReport.report.maxContent                  = this.myReport.maxContent;
    myReport.report.inflowSummary               = this.myReport.inflowSummary;
    myReport.report.startingEOMContent          = this.myReport.startingEOMContent;
    myReport.report.reportId                    = this.myReport.reportId;

    myReportMonthlyJson = { "reportMonths":[] };
    this.myReport.monthly.forEach( (element: any) => myReportMonthlyJson.reportMonths.push(this.saveArrayToObjectsJson( element ) ));

    myReport.report.monthly = myReportMonthlyJson.reportMonths;

    for ( let i = 0; i < this.dailyData.length; i++ ) {
      
      myDailyJson = { "dailyData":[] };
      this.dailyData[i].forEach( (element: any) => myDailyJson.dailyData.push(this.saveArrayToObjectsJson( element ) ));
      mySaveAllOperationalData[i] = myDailyJson.dailyData;
    }
    myReport.report.daily = mySaveAllOperationalData;

    //This is what needs to be saved 
    let fileContent:string = JSON.stringify(myReport);

    const file = new Blob([fileContent], { type: "test/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = this.fileName;
    link.click();
    link.remove();

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
      '-------- Operations-Data-Component.clearManualEditInputs -------- '
    );
    
    this. outflowPercentage = 0;
    this.outflowDirection = "Decrease";
  
    this.editMonthlyData      = this.operationsService.resetMonthlyData();
    this.dailyData = this.operationsService.getDailyData();
  }

  addToGridElevation() {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.addToGridElevation --------'
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

    for (let i = 0; i < this.myReport.monthly.length; i++) {
      myModifiedData[i] = this.myReport.monthly[i].eomElevation;
    }

    elevationAdjustedData.data = myModifiedData;

    this.elevationGridData.datasets[4] = elevationAdjustedData;

  }

  getElevationGridData() {
    // console.log('--- getElevationGridData ---');
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getElevationGridData --------'
    );

    let myTempMaxLabel     = constants.MAX_LABEL     + " (" + constants.MAX_ELEVATION_LEVEL + ")";
    let myTempWarningLabel = constants.WARNING_LABEL + " (" + constants.WARNING_ELEVATION_LEVEL + ")";

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

    let dayIndex:number = this.getStartingMonthlyIndex(this.myReport.monthly);
    let maxIndex:number = this.getMaxWaterLevelIndex(this.myReport.monthly);
    let minIndex:number = this.getMinWaterLevelIndex(this.myReport.monthly);

    myDateLineData[dayIndex] =  (this.myReport.monthly[minIndex].eomElevation - 3);

    for (let i = 0; i < this.myReport.monthly.length; i++) {
      myProposedData[i] = this.myReport.monthly[i].eomElevation;
      myInflowData[i] = Number(this.myReport.monthly[i].inflow);
      myOutflowData[i] = Number(this.myReport.monthly[i].outflow);
      
      myLabels[i] =
        this.myReport.monthly[i].month + 
        ' ' +
        this.myReport.monthly[i].dateRange; 
      myWarning[i] = constants.WARNING_ELEVATION_LEVEL;
      myMax[i] = constants.MAX_ELEVATION_LEVEL;
    }

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
      '-------- Operations-Data-Component.processData --------'
    );
    this.errors = [];
    if (this.proposedOperations.length > 0) {
      this.operations = this.operationsService.getOperationsReport(this.proposedOperations);

      this.myReport.reportHeader        = this.operations[1] + " - " + this.operations[3];  //TODO can I delete this

    } else {
      this.myLog.log('INFO', 'proposedOperations data is empty');
    }

    this.getOperationData();
    this.showDataDialog();
  }

  clearData(event: MouseEvent) {
    this.proposedOperations = '';
  }

  getEOMContent(baseContent: number, inflow: number, outflow: number): number {
    // this.myLog.log(
    //   'INFO',
    //   '-------- Operations-Data-Component.getEOMContent -------- ' +
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
    //   '-------- Operations-Data-Component.setEOMContent -------- ' +
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
      '-------- Operations-Data-Component.getElevationWarning --------'
    );

    let warning = '';

    if (elevation > constants.MAX_ELEVATION_LEVEL) {
      warning = constants.EOM_MAX_LEVEL;
    } else if (elevation > constants.WARNING_ELEVATION_LEVEL) {
      warning = constants.EOM_WARNING_LEVEL;
    }
    
    return warning;
  }

  closeDaily() {
    this.dailyDialogVisible = false;
  }

  rollupDaily(myRollupData: any) {

    console.log("--- rollupDaily ---");

    let outflow1: number = 0;
    let outflow2: number = 0;
    let dayIndex = this.getStartingMonthlyIndex(this.editMonthlyData);

    for (let i = 0; i < (myRollupData.length-1); i++) {
      
      let cfsDifference = 0;

      if (myRollupData[i].manualOutflowCFS != myRollupData[i].lastRolledUpCFS) {
        cfsDifference = Number(myRollupData[i].manualOutflowCFS) -  Number(myRollupData[i].lastRolledUpCFS);
      }

      if ( Math.abs(cfsDifference) >=  0.001) {
        if ( i < 15 ) {
          outflow1 =   outflow1 + this.elevationService.getAcreFeetFromCFS(cfsDifference);
        } else {
          outflow2 =   outflow2 + this.elevationService.getAcreFeetFromCFS(cfsDifference);
        }
      } else {
        // console.log("Do not change");
      }

      myRollupData[i].lastRolledUpCFS = myRollupData[i].manualOutflowCFS;
    }

    if (outflow1 != 0) {
      this.modifiedReportTotals[0].manualOutflow          = Number((this.modifiedReportTotals[0].outflow + outflow1).toFixed(3));
      this.modifiedReportTotals[0].manualOutflowColor     = constants.CELL_CHANGE_COLOR_TEXT;
      this.modifiedReportTotals[0].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;

      if (this.editMonthlyData[this.monthIndex].manualOutflow == 0) {
        this.editMonthlyData[this.monthIndex].manualOutflow          = Number((this.editMonthlyData[this.monthIndex].outflow + outflow1).toFixed(3));
      } else {
        this.editMonthlyData[this.monthIndex].manualOutflow          = Number((this.editMonthlyData[this.monthIndex].manualOutflow + outflow1).toFixed(3));
      }
      
      this.editMonthlyData[this.monthIndex].rolledUp               = true;
      this.editMonthlyData[this.monthIndex].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
      this.editMonthlyData[this.monthIndex].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;

      this.recalculateEOM(this.editMonthlyData,  this.monthIndex);
    }

    if (outflow2 != 0) {
      this.modifiedReportTotals[1].manualOutflow          = Number((this.modifiedReportTotals[1].outflow + outflow2).toFixed(3));
      this.modifiedReportTotals[1].manualOutflowColor     = constants.CELL_CHANGE_COLOR; 
      this.modifiedReportTotals[1].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT; 

      if (this.editMonthlyData[this.monthIndex+1].manualOutflow == 0) {
        this.editMonthlyData[this.monthIndex+1].manualOutflow          = Number((this.editMonthlyData[this.monthIndex+1].outflow + outflow2).toFixed(3));
      } else {
        this.editMonthlyData[this.monthIndex+1].manualOutflow          = Number((this.editMonthlyData[this.monthIndex+1].manualOutflow + outflow2).toFixed(3));
      }

      this.editMonthlyData[this.monthIndex+1].rolledUp               = true;
      this.editMonthlyData[this.monthIndex+1].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
      this.editMonthlyData[this.monthIndex+1].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;

      this.recalculateEOM(this.editMonthlyData, (this.monthIndex + 1));
    }
    
    this.modifiedReportTotals[2].manualOutflow          = Number( (this.modifiedReportTotals[0].manualOutflow + this.modifiedReportTotals[1].manualOutflow).toFixed(3));

    let outflowDifference = ( this.modifiedReportTotals[0].outflow + this.modifiedReportTotals[1].outflow) - (this.modifiedReportTotals[0].manualOutflow + this.modifiedReportTotals[1].manualOutflow);

    this.modifiedReportTotals[3].manualOutflow          = Number( (outflowDifference).toFixed(3));

    //add back in this.recalculateEOM(this.modifiedReportTotals, 0);

    //this.recalculateDaily(myRecalcDailyData: any, myRollupData[0].monthIndex:number);

    this.dailyDialogVisible = false;

    this.rollupChange = false;

  }

  resetDaily(myResetDailyData: any) {
    console.log("--- reset Daily ---");
    // console.log(this.modifiedReportTotals);

    let resetMonth1:number = myResetDailyData[0].monthIndex;  //Need to get the index to the month array, 1st half
    let resetMonth2:number = myResetDailyData[20].monthIndex; //Need to get the index to the month array, 2nd half

    for (let i = 0; i < (myResetDailyData.length); i++) {

      myResetDailyData[i].manualOutflowCFS = myResetDailyData[i].lastOutflowCFS;
      myResetDailyData[i].lastRolledUpCFS  = myResetDailyData[i].lastOutflowCFS;;
      myResetDailyData[i].eomContent             = myResetDailyData[i].orgEomContent;
      myResetDailyData[i].manualOutflowColor     = "";
      myResetDailyData[i].manualOutflowTextColor = "";
      
      if (myResetDailyData[i].eomElevation != 0) {
        myResetDailyData[i].eomElevation = this.elevationService.getElevation( myResetDailyData[i].eomContent);
        myResetDailyData[i].elevationWarning = this.getElevationWarning(myResetDailyData[i].eomElevation);
      }

    }

    this.modifiedReportTotals[0].outflow                = this.modifiedReportTotals[0].originalOutflow;
    this.modifiedReportTotals[0].eomContent             = this.modifiedReportTotals[0].originalEomContent;
    this.modifiedReportTotals[0].eomElevation           = this.elevationService.getElevation( this.modifiedReportTotals[0].eomContent );
    this.modifiedReportTotals[0].elevationWarning       = this.getElevationWarning(this.modifiedReportTotals[0].eomElevation);
    this.modifiedReportTotals[0].manualOutflowColor     = ""; 
    this.modifiedReportTotals[0].manualOutflowTextColor = ""; 

    this.modifiedReportTotals[1].outflow                = this.modifiedReportTotals[1].originalOutflow;
    this.modifiedReportTotals[1].eomContent             = this.modifiedReportTotals[1].originalEomContent;
    this.modifiedReportTotals[1].eomElevation           = this.elevationService.getElevation( this.modifiedReportTotals[1].eomContent );
    this.modifiedReportTotals[1].elevationWarning       = this.getElevationWarning(this.modifiedReportTotals[1].eomElevation);
    this.modifiedReportTotals[1].manualOutflowColor     = ""; 
    this.modifiedReportTotals[1].manualOutflowTextColor = ""; 

    this.modifiedReportTotals[2].outflow                = this.modifiedReportTotals[0].outflow + this.modifiedReportTotals[1].outflow;
    this.modifiedReportTotals[2].eomContent             = 0.0;
    this.modifiedReportTotals[2].eomElevation           = 0.0;
    this.modifiedReportTotals[2].manualOutflowColor     = ""; 
    this.modifiedReportTotals[2].manualOutflowTextColor = ""; 

    this.modifiedReportTotals[3].outflow                = 0.0;
    this.modifiedReportTotals[3].originalOutflow        = this.modifiedReportTotals[3].outflow;
    this.modifiedReportTotals[3].eomContent             = 0.0;
    this.modifiedReportTotals[3].eomElevation           = 0.0;
    this.modifiedReportTotals[3].manualOutflowColor     = ""; 
    this.modifiedReportTotals[3].manualOutflowTextColor = "";  

    if (this.editMonthlyData[resetMonth1].rolledUp) {
      this.editMonthlyData[resetMonth1].manualOutflow          =  this.operationsService.deepClone(this.myReport.monthly[resetMonth1].manualOutflow);
      this.editMonthlyData[resetMonth1].manualOutflowColor     =  "";
      this.editMonthlyData[resetMonth1].manualOutflowTextColor =  "";
      this.editMonthlyData[resetMonth1].rolledUp               = false;
    }

    if (this.editMonthlyData[resetMonth2].rolledUp) {
      this.editMonthlyData[resetMonth2].manualOutflow          =  this.operationsService.deepClone(this.myReport.monthly[resetMonth2].manualOutflow);
      this.editMonthlyData[resetMonth2].manualOutflowColor     =  "";
      this.editMonthlyData[resetMonth2].manualOutflowTextColor =  "";
      this.editMonthlyData[resetMonth2].rolledUp               = false;
    }
    
    this.changeDailyFromMonthly(this.editMonthlyData[resetMonth1]);

    this.changeDailyFromMonthly(this.editMonthlyData[resetMonth2]);

    this.recalculateEOM(this.editMonthlyData, 0 );
    
    this.rollupChange = false;
  }

  recalculateDaily(myRecalcDailyData: any, myDayIndex:number) {
    console.log("--- recalculateDaily ---");
    // console.log("--- myDayIndex      " + myDayIndex);
    // console.log("--- this.monthIndex " + this.monthIndex);
    // console.log("--- myRecalcDailyData ---");
    // console.log(myRecalcDailyData);

    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.recalculateDaily -------- ' +
      myDayIndex
    );

    let cfsDifference = Number(myRecalcDailyData[myDayIndex].manualOutflowCFS) -  Number(myRecalcDailyData[myDayIndex].lastOutflowCFS);

    myRecalcDailyData[myDayIndex].lastOutflowCFS = myRecalcDailyData[myDayIndex].manualOutflowCFS;

    if ( Math.abs(cfsDifference) <  0.001) {
      return;
    }

    let eomDifference = this.elevationService.getAcreFeetFromCFS(cfsDifference);

    let totalManualOutflow:number = 0;

    for (let i = myDayIndex; i < (myRecalcDailyData.length); i++) {
      
      myRecalcDailyData[i].eomContent =  myRecalcDailyData[i].eomContent - eomDifference;
      if (myRecalcDailyData[i].eomContent > 0) {
       
        myRecalcDailyData[i].eomElevation = this.elevationService.getElevation( myRecalcDailyData[i].eomContent);
        myRecalcDailyData[i].elevationWarning = this.getElevationWarning(myRecalcDailyData[i].eomElevation);
      }
      
    }

    for (let i = 0; i < (myRecalcDailyData.length-1); i++) {
      
      totalManualOutflow = totalManualOutflow + Number(myRecalcDailyData[i].manualOutflowCFS);
    }
    
    myRecalcDailyData[(myRecalcDailyData.length-1)].manualOutflowCFS = totalManualOutflow;
    myRecalcDailyData[myDayIndex].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
    myRecalcDailyData[myDayIndex].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;

    if (myDayIndex < 15) {
      
      this.modifiedReportTotals[0].outflow          = this.modifiedReportTotals[0].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);
      this.modifiedReportTotals[0].eomContent       = this.modifiedReportTotals[0].eomContent - eomDifference;
      this.modifiedReportTotals[0].eomElevation     = this.elevationService.getElevation( this.modifiedReportTotals[0].eomContent);
      this.modifiedReportTotals[0].elevationWarning = this.getElevationWarning(this.modifiedReportTotals[0].eomElevation);
      
      this.modifiedReportTotals[1].eomContent       = this.modifiedReportTotals[1].eomContent - eomDifference;
      this.modifiedReportTotals[1].eomElevation     = this.elevationService.getElevation( this.modifiedReportTotals[1].eomContent);
      this.modifiedReportTotals[1].elevationWarning = this.getElevationWarning(this.modifiedReportTotals[1].eomElevation);

    } else {
      
      this.modifiedReportTotals[1].outflow          = this.modifiedReportTotals[1].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);
      this.modifiedReportTotals[1].eomContent       = this.modifiedReportTotals[1].eomContent - eomDifference;
      this.modifiedReportTotals[1].eomElevation     = this.elevationService.getElevation( this.modifiedReportTotals[1].eomContent);
      this.modifiedReportTotals[1].elevationWarning = this.getElevationWarning(this.modifiedReportTotals[1].eomElevation);
    }

    this.modifiedReportTotals[2].outflow = this.modifiedReportTotals[2].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);
    // TODO  this needs to be recalculated  this.modifiedReportTotals[3].outflow = this.modifiedReportTotals[3].outflow + this.elevationService.getAcreFeetFromCFS(cfsDifference);

    this.rollupChange = true;

  }

  recalculateEOM(myRecalcData: any, myIndex:number) {
    console.log("--- recalculateEOM ---");
    // console.log("myIndex " + myIndex);

    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.recalculateEOM -------- ' +
      myIndex
    );
    
    let myEomContent = 0;
    let index = Number(myIndex);
    let myInflow:number = Number(myRecalcData[index].manualInflow);
    let myOutflow:number = Number(myRecalcData[index].manualOutflow);

    this.recaculateYearType = 0.0;

    for (
      let i = index; i < (myRecalcData.length ); i++ ) {

      if (i === 0) {
        myEomContent = this.myReport.startingEOMContent;
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

      if ((myRecalcData[i].eomContent) && (myRecalcData[i].eomContent != 0) ) {

        myRecalcData[i].eomContent =
          myEomContent + myInflow - myOutflow;
        
        if (myRecalcData[i].eomContent > 0) {
          myRecalcData[i].eomElevation =
            this.elevationService.getElevation(
              myRecalcData[i].eomContent
            );
          
          myRecalcData[i].elevationWarning = this.getElevationWarning(
            myRecalcData[i].eomElevation
          );

        }
      }
    }
  }

  adjustManualInput(myData:any, myIndex:number, inflowField:boolean) {
    console.log("--- adjustManualInput ---");

    if (inflowField) {
      this.editMonthlyData[Number(myIndex)].manualInflow           = Number((this.editMonthlyData[Number(myIndex)].manualInflow).toFixed(3));
      this.editMonthlyData[Number(myIndex)].manualInflowColor      = constants.CELL_CHANGE_COLOR;
      this.editMonthlyData[Number(myIndex)].manualInflowTextColor  = constants.CELL_CHANGE_COLOR_TEXT;
    } else {
      this.editMonthlyData[Number(myIndex)].manualOutflow          = Number((this.editMonthlyData[Number(myIndex)].manualOutflow).toFixed(3));
      this.editMonthlyData[Number(myIndex)].rolledUp               = false;
      this.editMonthlyData[Number(myIndex)].changed                = true;
      this.editMonthlyData[Number(myIndex)].manualOutflowColor     = constants.CELL_CHANGE_COLOR;
      this.editMonthlyData[Number(myIndex)].manualOutflowTextColor = constants.CELL_CHANGE_COLOR_TEXT;
    }
    
    this.recalculateEOM(myData,myIndex); 
    this.changeDailyFromMonthly(this.editMonthlyData[Number(myIndex)]);
  }

  getEOMContentList(data: any): number[] {  //TODO do I need this
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getEOMContentList --------'
    );

    let eomContent = new Array();

    let myEomContent = 0;

    eomContent = [];

    for (let i = 0; i < data.length; i++) {
      myEomContent = this.myReport.startingEOMContent + data[i].inflow - data[i].outflow;
      eomContent.push(myEomContent);
    }

    return eomContent;
  }

  setEOMContentList(data: any, baseContent: number) {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.setEOMContentList --------'
    );

    let baseEOM = 0;
    this.myReport.yearTypeInflow = 0.0;
    this.setYearType();

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        baseEOM = this.myReport.startingEOMContent;
      } else {
        baseEOM = data[i - 1].eomContent;
      }

      let myEOM = this.setEOMContent(baseEOM, data[i].inflow, data[i].outflow);
      data[i].eomContent = myEOM;

      if (i > 9 && i < 18) {
        
        this.myReport.yearTypeInflow = this.myReport.yearTypeInflow + data[i].inflow; 
      }
    }
  }

  convertStringToNumber(myNumberString:string): number {

    return Number(myNumberString);

  }

  convertMonthStringToNumber(myMonthString:string): number {

    let month:number = 0;

    let myMonth:string = "";

    if (myMonthString) {

      myMonth = myMonthString.toLowerCase();

    }

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
    
    // console.log(month);
    return month;
  }

  convertReportDate(reportDate:string): string {
    let myDate = reportDate.replaceAll(',','');
    
    let dateArray:any = myDate.split(" ");

    let myMonth:string = dateArray[0];
    
    this.myReport.reportYear = dateArray[2];
    this.myReport.reportDay  =  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    
    switch (myMonth) {
      case "January": {
        myDate = dateArray[2] + "-01-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '01';
        break;
      }
      case "February": {
        myDate = dateArray[2] + "-02-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '02';
        break;
      }
      case "March": {
        myDate = dateArray[2] + "-03-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '03';
        break;
      }
      case "April": {
        myDate = dateArray[2] + "-04-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '04';
        break;
      }
      case "May": {
        myDate = dateArray[2] + "-05-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '05';
        break;
      }
      case "June": {
        myDate = dateArray[2] + "-06-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '06';
        break;
      }
      case "July": {
        myDate = dateArray[2] + "-07-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '07';
        break;
      }
      case "August": {
        myDate = dateArray[2] + "-08-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '08';
        break;
      }
      case "September": {
        myDate = dateArray[2] + "-09-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '09';
        break;
      }
      case "October": {
        myDate = dateArray[2] + "-10-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '10';
        break;
      }
      case "November": {
        myDate = dateArray[2] + "-11-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '11';
        break;
      }
      case "December": {
        myDate = dateArray[2] + "-12-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        this.myReport.reportMonth =  '12';
        break;
      }
      default : {
        myDate = dateArray[2] + "-" + dateArray[0] + "-" +  Number(dateArray[1]).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
      }
    }

    return myDate;
  }

  getOperationData() {
    console.log('--- getOperationData ---');
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getOperationData --------'
    );

    this.myReport.startingEOMContent = 0.0;
    let temp: any = this.operationsService.getJson();
    this.errors = this.operationsService.getErrorsJson();

    if ( (temp.data) && (!this.errors.fatalError) ) {

      this.myReport = this.operationsService.getReport();
  
      this.myReport.reportNameTitle = temp.name;
      this.myReport.reportDateTitle = temp.date;
  
      this.myReport.reportHeader          = this.myReport.reportNameTitle + " - " + this.myReport.reportDateTitle;

      this.myReport.reportName = temp.name.replaceAll(' ','-');

      this.myReport.reportDate = this.convertReportDate(temp.date);

      let forecast:any = temp.forecast.split(" ");
      
      this.myReport.forecastDate = forecast[0] + " " + forecast[1] + " " + this.myReport.reportYear;

      if (forecast.length === 7) {
        
        this.myReport.forecastDate     = forecast[0] + " " + forecast[1] + " " + this.myReport.reportYear;
        this.myReport.forecastPercent  = forecast[4].replaceAll('%','');
        this.myReport.forecastAcreFeet = forecast[5].replaceAll('(','').replaceAll(')','').replaceAll(',','');

      } else {
        this.myReport.forecastDate     = forecast[0] + " " + this.myReport.reportYear;
        this.myReport.forecastPercent  = forecast[3].replaceAll('%','');
        this.myReport.forecastAcreFeet = forecast[4].replaceAll('(','').replaceAll(')','').replaceAll(',','');
      }

      this.myReport.startingEOMContent = Number(temp.startingEOMContent.replaceAll(',',''));

      let normal:any =  temp.normal.split(" ");
      this.myReport.normal =  normal[0];

      let maxContent:any       = temp.maxContent.split(" ");
      this.myReport.maxContent = maxContent[0].replaceAll(',','');
      
      let inflowSummary:any       = temp.inflowSummary.split(" ");
      this.myReport.inflowSummary = inflowSummary[0].replaceAll(',','');

      this.fileName = this.myReport.reportDate + "-" + this.myReport.reportName.replaceAll(' ','-');
      this.myReport.reportId =  this.myReport.reportDate.replaceAll('-','');

      this.myReport.startingEOMContent = parseInt(temp.startingEOMContent.replaceAll(',', ''));

      this.myReport.eomContentLabel =
        'EOM Content ' +
        this.myReport.startingEOMContent +
        ' elevation ' +
        this.elevationService.getElevation(this.myReport.startingEOMContent).toFixed(2);

      this.setEOMContentList(
        this.myReport.monthly,
        this.myReport.startingEOMContent
      );

      this.getElevationGridData();
      this.setYearType();
      this.myReport.reportHeader          = this.myReport.reportNameTitle + " - " + this.myReport.reportDateTitle;
  
      this.dailyData = this.operationsService.getDailyData();

      this.editMonthlyData = this.operationsService.getEditMonthlyData();
    }
    else if (this.errors.fatalError) {
      this.errorInputVisible = true;
    }

  }

  openPDF(pdf:any){
    window.open(pdf);
    return false;
  }
}
