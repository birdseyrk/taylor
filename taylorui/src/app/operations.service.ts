import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Report } from '../modules/report.module';
import { Monthly } from '../modules/report.module';
import { Daily } from '../modules/report.module';

import * as constants from '../constants';
import { ElevationService } from './elevation.service';
import { LoggingService } from './logging.service';
import { InputError } from './InputError';

import {parse, stringify, toJSON, fromJSON} from 'flatted';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor( 
    private myLog:LoggingService,
    public elevationService: ElevationService) { 
      
    }

    myReport:Report = new Report();

    editMonthlyData:Monthly[] = [];
  
    myJson:string = '{}';
    errorJson:any = {"errors":[],"fatalError":false};

    startingEOM:number = 0;
    months:number = 12;
    
    reportYear:string = '';
    reportDay:string = '';
    reportMonth:string = '';
    
    myMonths = constants.MONTHS;
  
    getOperationsReport(proposedOperations: any): string[] {
      this.myLog.log('INFO', '-------- OperationsService.getOperationsReport --------');
  
      let operationsReport: any = new Array();
      let operIndex = 0;
      let newLineChar = 10;
      let lineString = '';
  
      for (let i = 0; i < proposedOperations.length; i++) {
  
        if (proposedOperations.charCodeAt(i) === newLineChar) {
          
          this.myLog.log('INFO', '-------- OperationsService.getOperationsReport --------');
          operationsReport.push(lineString.trim());
          operIndex++;
          lineString = '';
        } else {
          lineString = lineString + proposedOperations[i];
        }
      }
  
      operationsReport.push(lineString.trim());
  
      this.myJson = this.setOperationalData(operationsReport);
  
      return operationsReport;
    }
  
    getRowArray(row: any, index:number): string {
      // console.log("--- getRowArray ---");

      let rowData:any = [];
      
      let myMonthly:Monthly = new Monthly();

      let rowObject:string = "{";
      
      rowData =  row.split(" ");

      let myMonth:string = rowData[0];
  
      rowObject = rowObject + '"month":"' +  rowData[0] + '",';

      rowObject = rowObject + '"dateRange":"' +  rowData[1] + '",';

      rowObject = rowObject + '"inflow":' + Number(rowData[2].replace(/,/g, '')) + ',';
 
      rowObject = rowObject + '"originalInflow":' + Number(rowData[2].replace(/,/g, '')) + ',';
      
      rowObject = rowObject + '"avgInflow":' + Number(rowData[3].replace(/,/g, '')) + ',';

      rowObject = rowObject + '"outflow":' + Number(rowData[4].replace(/,/g, '')) + ',';

      rowObject = rowObject + '"originalOutflow":' + Number(rowData[4].replace(/,/g, '')) + ',';

      rowObject = rowObject + '"avgOutflow":' + Number(rowData[5].replace(/,/g, '')) + ',';

      rowObject = rowObject + '"eomContent":' + Number(rowData[6].replace(/,/g, '')) + ',';

      rowObject = rowObject + '"originalEomContent":' + Number(rowData[6].replace(/,/g, '')) + ',';

      rowObject = rowObject + '"eomElevation":' + Number(rowData[7].replace(/,/g, '')) + ',';
      
      var mySplit1              =  rowData[1].split("-");
      
      rowObject = rowObject + '"days":' +  (parseInt(mySplit1[1]) - parseInt(mySplit1[0]) + 1) + ',';
    
      switch (myMonth) {
        case "Apr": {
          rowObject = rowObject + '"inflowSummaryColor":"' + constants.INFLOW_SUMMARY_COLOR + '"';
          break;
        }
        case "May": {
          rowObject = rowObject + '"inflowSummaryColor":"' + constants.INFLOW_SUMMARY_COLOR + '"';
          break;
        }
        case "Jun": {
          rowObject = rowObject + '"inflowSummaryColor":"' + constants.INFLOW_SUMMARY_COLOR + '"';
          break;
        }
        case "Jul": {
          rowObject = rowObject + '"inflowSummaryColor":"' + constants.INFLOW_SUMMARY_COLOR + '"';
          break;
        }
        default : {
          rowObject = rowObject + '"inflowSummaryColor":"' + "" + '"';
        }
      }
  
      rowObject = rowObject + "}";
      
      let myObject:any = JSON.parse(rowObject);
      
      myMonthly.month              =  myObject.month;
      myMonthly.dateRange          =  myObject.dateRange;
      myMonthly.days               =  myObject.days;
      myMonthly.inflow             =  myObject.inflow;
      myMonthly.inflowCF           =  myObject.inflow * constants.ACTOSQFT;
      myMonthly.originalInflow     =  myObject.inflow;
      myMonthly.avgInflowCFS       =  Number(myMonthly.inflowCF / ( myMonthly.days * constants.SECONDSPERDAY));
      myMonthly.outflow            =  myObject.outflow;
      myMonthly.outflowCF          =  myObject.outflow * constants.ACTOSQFT;
      myMonthly.originalOutflow    =  myObject.outflow;
      myMonthly.avgOutflowCFS      =  Number(myMonthly.outflowCF / ( myMonthly.days * constants.SECONDSPERDAY));
      myMonthly.eomContent         =  myObject.eomContent;
      myMonthly.originalEomContent = myObject.eomContent;
      myMonthly.eomElevation       =  myObject.eomElevation;
      myMonthly.inflowSummaryColor =  myObject.inflowSummaryColor;
      myMonthly.elevationWarning   = this.elevationService.getElevationWarning(myMonthly.eomElevation);
      myMonthly.index              = index;

      this.myReport.monthly.push(myMonthly);
      
      return myObject;
    }
  
    getJson():string {  //TODO get rid of this.
      // console.log('------------------- getJson --------------------');
      return this.myJson;
    }
  
    getReport():any {
      // console.log('------------------- getReport --------------------');
      // console.log(this.myReport);

      // console.log('-------------- myReport stringify -------------------');
      // console.log(JSON.stringify(this.myReport));

      return this.myReport;
    }

    resetMonthlyData():Monthly[] {
      console.log('--- resetMonthlyData ---');
      // console.log('--- this.myReport.monthly ---');
      // console.log(this.myReport.monthly);

      this.editMonthlyData = this.deepClone(this.myReport.monthly);
      // console.log('--- this.editMonthlyData ---');
      // console.log(this.editMonthlyData);
      return this.editMonthlyData;

    }
  
    getEditMonthlyData():any {
      // console.log('------------------- getEditMonthlyData --------------------');
      // console.log(this.editMonthlyData);

      // console.log('-------------- myReport stringify -------------------');
      // console.log(JSON.stringify(this.editMonthlyData));

      return this.editMonthlyData;

    }
  
    getMonthlyData():any {
      // console.log('------------------- getMonthlyData --------------------');
      // console.log(this.myReport.monthly);

      // console.log('-------------- myReport stringify -------------------');
      // console.log(JSON.stringify(this.myReport.monthly));

      return this.myReport.monthly;

    }
  
    getErrorsJson():string {
      return this.errorJson;
    }
  
    clearOperationalData() {
      // console.log('--- clearOperationalData ---');
      this.myLog.log('INFO', '-------- OperationsService.clearJson --------');
      this.myJson = '{}';
      this.myReport.daily  = [];
      this.myReport.monthly = [];
      this.editMonthlyData = [];
      this.myReport = new Report();
      // console.log('--- this.myReport ---');
      // console.log(this.myReport);
    }
  
    convertFlowUnitValues(operations:any):any {
      this.myLog.log('INFO', '-------- OperationsService.convertFlowUnitValues -------- ');
  
      const newArray = operations.data.map((element: any,  array: any[]) => {
  
        element["inflowCF"]       =  element["inflow"]    * constants.ACTOSQFT;
        element["outflowCF"]      =  element["outflow"]   * constants.ACTOSQFT;
        element["avgInflowCFS"]   =  element["inflowCF"]  /  (element["days"] * constants.SECONDSPERDAY);
        element["avgOutflowCFS"]  =  element["outflowCF"] /  (element["days"] * constants.SECONDSPERDAY);
    
        element["elevationWarning"]  = '';
        
        if (element["eomElevation"] > constants.MAX_ELEVATION_LEVEL) {
          element["elevationWarning"] = constants.EOM_MAX_LEVEL;
        } else if (element["eomElevation"] > constants.WARNING_ELEVATION_LEVEL) {
          element["elevationWarning"] = constants.EOM_WARNING_LEVEL;
        }
       
     });
      
      return operations;
  
    }

    getDailyData():any {
      // console.log('--- operations service getDailyData ---');
      
        return this.deepClone(this.myReport.daily);
    }

    setDailyData = (myMonth: Monthly[]): Daily[] => { 
      console.log("--- setDailyData ---");
      this.myLog.log('INFO', '-------- OperationsService.setDailyData --------');

      let index = 0;
      let nextIndex = index + 1;

      let myEOMContent = 0;
      let totalEomContent:number = 0;

      // console.log('--- myMonth ---');
      // console.log(myMonth);

      this.myReport.daily = [];

      for (let monthLink = 0; monthLink < this.months; monthLink++) {
        if (monthLink == 0) {
          this.startingEOM = this.startingEOM
          index = 0;
          nextIndex = index + 1;
          
        } else {
          
          index = monthLink * 2;
          nextIndex = index + 1;
          
          this.startingEOM =  myMonth[index-1].eomContent;
        }

        // let month1Str:string = '';
        // let month2Str:string = '';
  
        let reportDailyData:Daily[]   = [];
        let month1:Monthly            = new Monthly();
        let month2:Monthly            = new Monthly();
  
        let totalInflow:number        = 0;
        let totalManualInflow:number  = 0;
        let totalOutflow:number       = 0;
        let totalManualOutflow:number = 0;
        let totalDays:number          = 0;

        month1 = myMonth[index];
        month2 = myMonth[nextIndex];
        
        myEOMContent    = month1.startingEOMContent;
        totalEomContent = myEOMContent;

        // console.log('--- month1 ---');
        // console.log(month1);
        // console.log('--- month2 ---');
        // console.log(month2);

        for (let i = 0; i < month1.days; i++) {
          
          let myDailyData:Daily = new Daily();
          
          totalEomContent   = totalEomContent + this.elevationService.getAcreFeetFromCFS(Number(month1.avgInflowCFS)) - this.elevationService.getAcreFeetFromCFS(Number(month1.avgOutflowCFS));
          
          totalInflow        = totalInflow + Number(month1.avgInflowCFS);
          totalManualInflow  = totalManualInflow + Number(month1.avgInflowCFS);
          totalOutflow       = totalOutflow + Number(month1.avgOutflowCFS);
          totalManualOutflow = totalManualOutflow + Number(month1.avgOutflowCFS);
          totalDays = totalDays + 1;

          myDailyData.day                 = month1.month + "-" + (i+1);
          myDailyData.avgInflowCFS        = Number(month1.avgInflowCFS);
          myDailyData.manualInflowCFS     = Number(month1.avgInflowCFS);
          myDailyData.index               = i;
          myDailyData.inflow              = Number(this.elevationService.getAcreFeetFromCFS(Number(month1.avgInflowCFS)));
          myDailyData.avgOutflowCFS       = Number(month1.avgOutflowCFS);
          myDailyData.lastOutflowCFS      = Number(month1.avgOutflowCFS);
          myDailyData.lastRolledUpCFS     = Number(month1.avgOutflowCFS);
          myDailyData.manualOutflowCFS    = Number(month1.avgOutflowCFS);
          myDailyData.outflow             = Number(this.elevationService.getAcreFeetFromCFS(Number(month1.avgOutflowCFS)));
          myDailyData.manualOutflow       = this.elevationService.getAcreFeetFromCFS(Number(month1.avgOutflowCFS));
          myDailyData.dailyChangePerDayAF = myDailyData.outflow - myDailyData.manualOutflow;
          myDailyData.eomContent          = myEOMContent + Number(this.elevationService.getAcreFeetFromCFS(Number(month1.avgInflowCFS))) - Number(this.elevationService.getAcreFeetFromCFS(Number(month1.avgOutflowCFS)));
          myDailyData.orgEomContent       = myEOMContent + Number(this.elevationService.getAcreFeetFromCFS(Number(month1.avgInflowCFS))) - Number(this.elevationService.getAcreFeetFromCFS(Number(month1.avgOutflowCFS)));
          myDailyData.eomElevation        = Number(this.elevationService.getElevation(myDailyData.eomContent));
          myDailyData.elevationWarning    = this.elevationService.getElevationWarning(myDailyData.eomElevation);
          myDailyData.startingEomContent  = myEOMContent;
          myDailyData.monthIndex          = month1.index;

          myEOMContent = myDailyData.eomContent;

          // console.log('--- myDailyData 1 ---');
          // console.log(myDailyData);

          reportDailyData.push(myDailyData);

        }
    
        for (let i = month1.days; i < (month1.days + month2.days ); i++) {
           
          let myDailyData:Daily = new Daily();

          totalEomContent = totalEomContent + Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgInflowCFS))) - Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgOutflowCFS)));
          totalInflow        = totalInflow + Number(month2.avgInflowCFS);
          totalManualInflow  = totalManualInflow + Number(month2.avgInflowCFS);
          totalOutflow       = totalOutflow + Number(month2.avgOutflowCFS);
          totalManualOutflow = totalManualOutflow + Number(month2.avgOutflowCFS);
          totalDays = totalDays + 1;

          myDailyData.day                 = month2.month + "-" + (i+1);
          myDailyData.avgInflowCFS        = Number(month2.avgInflowCFS);
          myDailyData.manualInflowCFS     = Number(month2.avgInflowCFS);
          myDailyData.index               = i;
          myDailyData.inflow              = Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgInflowCFS)));
          myDailyData.avgOutflowCFS       = Number(month2.avgOutflowCFS);
          myDailyData.outflow             = Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgOutflowCFS)));
          myDailyData.manualOutflowCFS    = Number(month2.avgOutflowCFS);
          myDailyData.manualOutflow       = Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgOutflowCFS)));
          myDailyData.lastOutflowCFS      = Number(month2.avgOutflowCFS);
          myDailyData.lastRolledUpCFS     = Number(month2.avgOutflowCFS);
          myDailyData.dailyChangePerDayAF = myDailyData.outflow - myDailyData.manualOutflow;
          myDailyData.eomContent          = myEOMContent + Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgInflowCFS))) - Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgOutflowCFS)));
          myDailyData.orgEomContent       = myEOMContent + Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgInflowCFS))) - Number(this.elevationService.getAcreFeetFromCFS(Number(month2.avgOutflowCFS)));
          myDailyData.eomElevation        = this.elevationService.getElevation(myDailyData.eomContent);
          myDailyData.elevationWarning    = this.elevationService.getElevationWarning(myDailyData.eomElevation);
          myDailyData.startingEomContent  = myEOMContent;
          myDailyData.monthIndex          = month2.index;

          myEOMContent = myDailyData.eomContent;

          // console.log('--- myDailyData 2 ---');
          // console.log(myDailyData);

          reportDailyData.push(myDailyData);
          
        }  

        let myDailyTotal:Daily = new Daily();
        myDailyTotal.day                = "Totals";
        myDailyTotal.avgInflowCFS       = totalInflow;
        
        myDailyTotal.manualInflowCFS    = totalManualInflow;
        myDailyTotal.manualInflow       = totalInflow;
        myDailyTotal.manualInflowCFS    = totalInflow;
        myDailyTotal.avgOutflowCFS      = totalOutflow;
        myDailyTotal.lastOutflowCFS     = totalOutflow;
        myDailyTotal.lastRolledUpCFS    = totalOutflow;
        myDailyTotal.manualOutflowCFS   = totalManualOutflow;
        myDailyTotal.manualOutflow      = totalOutflow;
        myDailyTotal.eomContent         = totalEomContent;
        myDailyTotal.orgEomContent      = 0;
        myDailyTotal.eomElevation       = 0;
        myDailyTotal.index              = totalDays
        myDailyTotal.elevationWarning   = "";

        reportDailyData.push(myDailyTotal);

        // console.log('--- myDailyTotal  ---');
        // console.log(myDailyTotal);

        this.myReport.daily.push(reportDailyData);
      
      }

      // console.log('--- this.myReport.daily ---');
      // console.log(this.myReport.daily);
      
      return this.myReport.daily; 

    }
  
    checkOperationalData = (operations: any[]): string  => {
      this.myLog.log('INFO', '-------- OperationsService.checkOperationalData --------');
      let fatalError = false;
  
      this.errorJson.errors = [];
      this.errorJson.fatalError = false;
  
      try {
        if (operations.length < 35) {
          this.myLog.log('ERROR', '-------- Did not copy all the data - Need 35 rows, but only got [' + operations.length + '] rows-------- ');
          let mystring = '"Data only contains ' + operations.length + ' lines, there should be 35 lines"';
          const myError = new InputError(0, mystring, true);
          fatalError = true;
          this.errorJson.errors.push(myError.getJson());
          throw new Error('Not all the data was copied');
        }
        for (let i = 0; i < operations.length; i++) {
          switch (i) {
            case 0: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
  
              if  ((spaceCount != 1) || (rowLength != 18) ||  (dataSplit[0] != 'Proposed') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
             
              break;
            }
            case 1: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
              
              if  ((spaceCount != 2) || (rowLength != 21) ||  (dataSplit[0] != 'Taylor') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 2: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              
              if  ((spaceCount != 6) ||  (dataSplit[2] != 'forecast') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 3: {
              let spaceCount = ( operations[i].split(" ").length - 1);
              
              if  ((spaceCount != 2)  ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 4: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
              if  ((spaceCount != 3) || (rowLength != 23) ||  (dataSplit[0] != 'Average') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 5: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
              if  ((spaceCount != 5) || (rowLength != 47) ||  (dataSplit[0] != 'Inflow') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 6: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
             
              if  ((spaceCount != 6) || (rowLength != 34) ||  (dataSplit[0] != 'Month') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 7: {
              let rowLength = operations[i].length;
              
              if (rowLength < 1)   {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              break;
            }
            case 8: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Nov')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
  
              break;
            }
            case 9: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Nov')  ||  (dataSplit[1] != '16-30')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 10: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Dec')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 11: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Dec')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 12: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jan')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 13: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jan')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 14: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Feb')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 15: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Feb')  ||  (dataSplit[1] != '16-28')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
  
              break;
            }
            case 16: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Mar')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 17: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Mar')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
  
              break;
            }
            case 18: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Apr')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 19: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Apr')  ||  (dataSplit[1] != '16-30')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 20: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'May')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 21: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'May')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
              }
              
              break;
            }
            case 22: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jun')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 23: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jun')  ||  (dataSplit[1] != '16-30')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 24: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jul')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 25: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jul')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 26: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Aug')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 27: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Aug')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 28: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Sep')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 29: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Sep')  ||  (dataSplit[1] != '16-30')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 30: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Oct')  ||  (dataSplit[1] != '1-15')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 31: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
             
              if  ((spaceCount != 7) ||  (dataSplit[0] != 'Oct')  ||  (dataSplit[1] != '16-31')) {
                fatalError = true;
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, true);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 32: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
             
              if  ((spaceCount != 3) || (rowLength != 26) ||  (dataSplit[3] != 'inflow') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
              
              break;
            }
            case 33: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
             
              if  ((spaceCount != 2) || (rowLength != 14) ||  (dataSplit[2] != 'normal') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
  
              break;
            }
            case 34: {
              let dataSplit = operations[i].split(" ");
              let spaceCount = ( operations[i].split(" ").length - 1);
              let rowLength = operations[i].length;
             
              if  ((spaceCount != 3) || (rowLength != 25) ||  (dataSplit[3] != 'Content') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
              }
  
              break;
            }
          default : {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
           
            if  ((spaceCount != 3) || (rowLength != 25) ||  (dataSplit[3] != 'Content') ) {
  
                let mystring = 'line ' + (i+1) + ' Invalid Row Data - extra-row. line: ' + operations[i];
                const myError = new InputError(i, mystring, false);
  
                this.errorJson.errors.push(myError.getJson());
             
            }
  
          }
          }
        }
  
      } catch (e) {
        
        this.errorJson["fatalError"] = fatalError;
  
       return this.errorJson;
      }
  
      this.errorJson["fatalError"] = fatalError;
    
      return this.errorJson;
    }

    setMyReport(report:Report) {
      console.log('--- operations.service setMyReport --- ');
      // console.log('--- report ---');
      // console.log(report);

      //return; //TODO remove this
      this.myReport = this.deepClone(report);

      this.resetMonthlyData();
      this.setDailyData(this.myReport.monthly);

      // console.log('--- this.myReport ---');
      // console.log(this.myReport);
    }
    
    setOperationalData = (operationsReport: any[]): any  => {
      this.myLog.log('INFO', '-------- OperationsService.setOperationalData --------');
  
      let jsonObject:any = {"data":[]};
  
      let myObject:any = this.checkOperationalData(operationsReport);
  
      if ( !(myObject).fatalError ) {
  
        jsonObject['title']              =  operationsReport[0];
        jsonObject['name']               =  operationsReport[1];
        jsonObject['forecast']           =  operationsReport[2];
        jsonObject['date']               =  operationsReport[3];
        jsonObject['label1']             =  operationsReport[4];
        jsonObject['label2']             =  operationsReport[5];
        jsonObject['label3']             =  operationsReport[6];
        jsonObject['startingEOMContent'] =  operationsReport[7];
        jsonObject['inflowSummary']      =  operationsReport[32];
        jsonObject['normal']             =  operationsReport[33];
        jsonObject['maxContent']         =  operationsReport[34];

        this.myReport.title              =  operationsReport[0];
        this.myReport.name               =  operationsReport[1];
        this.myReport.forecast           =  operationsReport[2];
        this.myReport.reportDate         =  operationsReport[3];
        this.myReport.label1             =  operationsReport[4];
        this.myReport.label2             =  operationsReport[5];
        this.myReport.label3             =  operationsReport[6];
        this.myReport.startingEOMContent =  Number(parseFloat(operationsReport[7].replace(/,/g, '')));
        this.myReport.inflowSummary      =  operationsReport[32];
        this.myReport.normal             =  operationsReport[33];
        this.myReport.maxContent         =  operationsReport[34];
        
        this.startingEOM = Number(parseFloat(jsonObject['startingEOMContent'].replace(/,/g, '')));

        let baseNumber:number = 8;
        let dataNumber:number = 24;
  
        for (let i = 0; i < dataNumber; i++) {
          jsonObject.data[i] =   this.getRowArray(operationsReport[(baseNumber + i)], i);
          jsonObject.data[i].index = i;
          if (i === 0) {
            jsonObject.data[i].startingEOMContent = this.startingEOM;
            this.myReport.monthly[i].startingEOMContent = Number(this.myReport.startingEOMContent);
          } else {
            jsonObject.data[i].startingEOMContent = jsonObject.data[(i-1)].originalEomContent;
            this.myReport.monthly[i].startingEOMContent = Number(this.myReport.monthly[(i-1)].eomContent);
          }
          
          this.myReport.monthly[i].elevationChange = Number( this.elevationService.getElevation(Number(this.myReport.monthly[i].eomContent)) - this.elevationService.getElevation(this.myReport.monthly[i].startingEOMContent));
          
        }

        this.setDailyData(this.myReport.monthly);

        this.editMonthlyData = this.deepClone(this.myReport.monthly);
    
        this.convertFlowUnitValues(jsonObject); 
        
        return jsonObject;
      
    } else {
  
      this.clearOperationalData();
  
      return [];
    }
  }

  getStartingMonthlyIndex(myData:any):number {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getMaxWaterLevelIndex -------- ');
  
    let myIndex:number = 0;

    for (let i = 0; i < myData.length; i++) {
      
     if (Number(this.reportMonth) === this.convertMonthStringToNumber(myData[i].month) ) {
      myIndex = i;
      // console.log('-----------------------------------');
      break;
     }

    }

  return myIndex;
  
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
    
    return month;
  }

  getMonthIndex(myData:any, myMonth:string):number {
    this.myLog.log(
      'INFO',
      '-------- Operations-Data-Component.getMonthIndex -------- ');
  
    let myIndex:number = 0;

    for (let i = 0; i < myData.length; i++) {
      
     if (Number(myMonth) === this.convertMonthStringToNumber(myData[i].month) ) {
      myIndex = i;
      // console.log('-----------------------------------');
      break;
     }

    }

    return myIndex;

  }
  
  getMonth(myMonth:string):any {  //TODO Do I need this
    // console.log('getMonth ' + myMonth);
    for (let i = 0; i < this.myMonths.length; i++) {
      if (myMonth === this.myMonths[i].abrev) {
        return this.myMonths[i];
      }
    }
    return this.myMonths[0];
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

  deepClone<T>(value: T): T {

    if (typeof value !== 'object' || value === null) {
      return value;
    }
    
    if (Array.isArray(value)) {
      return this.deepArray(value);
    }

    return this.deepObject(value);
  }

  deepObject<T extends {} > (source: T) {
    const result = {} as T;
    Object.keys(source).forEach((key) => {
      const value = source[key as keyof T];
      result[key as keyof T] = this.deepClone(value);
    }, {})
    
    return result as T;
  }

  deepArray<T extends any[]>(collection: T):any {
    return collection.map((value) => {
      
      return this.deepClone(value);
    })
  }

}
