import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import * as constants from '../constants';
import { ElevationService } from './elevation.service';
import { LoggingService } from './logging.service';
import { InputError } from './InputError';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor( 
    private myLog:LoggingService,
    public elevationService: ElevationService) { 
      
    }
  
    myJson:string = '{}';
    errorJson:any = {"errors":[],"fatalError":false};


    startingEOM:number = 0;
    months:number = 12;
  
    getOperations(proposedOperations: any): string[] {
      this.myLog.log('INFO', '-------- OperationsService.getOperations --------');
  
      let operations: any = new Array();
      let operIndex = 0;
      let newLineChar = 10;
      let lineString = '';
  
      for (let i = 0; i < proposedOperations.length; i++) {
        // console.log(
        //   'i = ' +
        //     i +
        //     ' char [' +
        //     proposedOperations[i] +
        //     '] str.charAt(0) is: [' +
        //     proposedOperations.charCodeAt(i) +
        //     ']'
        // );
  
        if (proposedOperations.charCodeAt(i) === newLineChar) {
          
          this.myLog.log('INFO', '-------- OperationsService.getOperations --------');
          operations.push(lineString.trim());
          operIndex++;
          lineString = '';
        } else {
          lineString = lineString + proposedOperations[i];
        }
      }
  
      operations.push(lineString.trim());
  
      this.myJson = this.setOperationalData(operations);

      // console.log('-------- operations ----------------');
      // console.log(operations);
  
      // console.log('-------- myJson ----------------');
      // console.log(this.myJson);

      // console.log('-------------- myJson stringify -------------------');
      // console.log(JSON.stringify(this.myJson));
  
      return operations;
    }
  
    getRowArray(row: any): string {
      let rowData:any = [];
      let myMonth:string = rowData[0];
      let rowObject:string = "{";
      
      rowData =  row.split(" ");
  
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
      //console.log(rowJson);
      //console.log (JSON.parse(rowObject));
      return JSON.parse(rowObject);
    }
  
    getJson():string {
      // console.log('------------------- getJson --------------------');
      // console.log(this.myJson);

      // console.log('-------------- getJson stringify -------------------');
      // console.log(JSON.stringify(this.myJson));

      return this.myJson;
    }
  
    getErrorsJson():string {
      return this.errorJson;
    }
  
    clearOperationalData() {
      this.myLog.log('INFO', '-------- OperationsService.clearJson --------');
      this.myJson = '{}';
    }
  
    convertFlowUnitValues(operations:any):any {
      this.myLog.log('INFO', '-------- OperationsService.convertFlowUnitValues -------- ');
  
      const newArray = operations.data.map((element: any,  array: any[]) => {

        //console.log(element["inflow"] + ' * ' + constants.ACTOSQFT + ' = ' + element["inflow"]    * constants.ACTOSQFT);
  
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

    getDailyData = (operations: any): any => {
      this.myLog.log('INFO', '-------- OperationsService.getDailyData --------');

      operations.daily = [];

      // console.log('--- getDailyData ---');
      // console.log(operations);

      
      let allDailyData :any = [];
      let index = 0;
      let nextIndex = index + 1;

      for (let i = 0; i < this.months; i++) {
        if (i == 0) {
          this.startingEOM = this.startingEOM
          index = 0;
          nextIndex = index + 1;
          // console.log("i " + i + " index " + index + " nextIndex " + nextIndex);
        } else {
          
          index = i * 2;
          nextIndex = index + 1;
          // console.log("i " + i + " index -1 " + (index-1) + " nextIndex " + nextIndex);
          this.startingEOM =  operations[index-1].eomContent;
        }

        // console.log('index ' + index + ' startingEOM '  + this.startingEOM);

        let month1Str:string = '';
        let month2Str:string = '';
  
        let dailyData:any = [];
        let month1:any    = [];
        let month2:any    = [];
  
        let totalInflow:number = 0;
        let totalOutflow:number = 0;
        let totalManualOutflow:number = 0;
        let totalDays:number = 0;
        let totalEomContent:number = this.startingEOM;

        month1Str =  JSON.stringify(operations[index]);
        month2Str =  JSON.stringify(operations[nextIndex]);

        // console.log('index ' + index + ' nextIndex ' + nextIndex);

        // console.log(month1Str);
        // console.log(month2Str);

        month1 = JSON.parse(month1Str);
        month2 = JSON.parse(month2Str);

        // console.log(month1);
        // console.log(month2);

        for (let i = 0; i < month1.days; i++) {
          let myData = {"day":"", "avgInflowCFS":0, "lastInflowCFS":0, "manualInflowCFS":0, "avgOutflowCFS":0, "lastOutflowCFS":0, "manualOutflowCFS":0, "orgEomContent":0, "eomContent":0, "eomElevation":0, "index":0, "manualOutFlowColor":"", "manualInFlowColor":"", "elevationWarning":"", "disabled":false};
          myData.day = month1.month + "-" + (i+1);
          myData.avgInflowCFS = month1.avgInflowCFS;
          myData.lastInflowCFS = month1.avgInflowCFS;
          myData.manualInflowCFS = month1.avgInflowCFS;
          myData.avgOutflowCFS = month1.avgOutflowCFS;
          myData.lastOutflowCFS = month1.avgOutflowCFS;
          myData.manualOutflowCFS = month1.avgOutflowCFS.toFixed(5);
          //console.log(myData);
          totalEomContent = totalEomContent + this.elevationService.getAcreFeetFromCFS(myData.avgInflowCFS) - this.elevationService.getAcreFeetFromCFS(myData.manualOutflowCFS);
          //console.log('totalEomContent ' + totalEomContent);
          myData.eomContent = totalEomContent;
          myData.orgEomContent = totalEomContent;
          myData.eomElevation = this.elevationService.getElevation(myData.eomContent);
          //console.log("myData.eomElevation " + myData.eomElevation);
          myData.elevationWarning = this.elevationService.getElevationWarning(myData.eomElevation);
          myData.index = (i+1);
          myData.manualOutFlowColor = "";
          totalInflow        = totalInflow + month1.avgInflowCFS;
          totalOutflow       = totalOutflow + month1.avgOutflowCFS;
          totalManualOutflow = totalManualOutflow + month1.avgOutflowCFS;
          totalDays = totalDays + 1;
          dailyData.push(myData);
        }
    
        for (let i = month1.days; i < (month1.days + month2.days ); i++) {
          let myData = {"day":"", "avgInflowCFS":0, "lastInflowCFS":0, "manualInflowCFS":0, "avgOutflowCFS":0, "lastOutflowCFS":0, "manualOutflowCFS":0, "orgEomContent":0, "eomContent":0, "eomElevation":0, "index":0, "manualOutFlowColor":"", "manualInFlowColor":"", "elevationWarning":"", "disabled":false};
          myData.day = month2.month + "-" + (i+1);
          myData.avgInflowCFS = month2.avgInflowCFS;
          myData.lastInflowCFS = month2.avgInflowCFS;
          myData.manualInflowCFS = month2.avgInflowCFS;
          myData.avgOutflowCFS = month2.avgOutflowCFS;
          myData.lastOutflowCFS = month2.avgOutflowCFS;
          myData.manualOutflowCFS = month2.avgOutflowCFS.toFixed(5);
          totalEomContent = totalEomContent + this.elevationService.getAcreFeetFromCFS(myData.avgInflowCFS) - this.elevationService.getAcreFeetFromCFS(myData.manualOutflowCFS);
          myData.eomContent = totalEomContent;
          myData.orgEomContent = totalEomContent;
          myData.eomElevation = this.elevationService.getElevation(myData.eomContent);
          //console.log("myData.eomElevation " + myData.eomElevation);
          myData.elevationWarning = this.elevationService.getElevationWarning(myData.eomElevation);
          myData.index = (i+1);
          myData.manualOutFlowColor = "";
          totalInflow        = totalInflow + month2.avgInflowCFS;
          totalOutflow       = totalOutflow + month2.avgOutflowCFS;
          totalManualOutflow = totalManualOutflow + month2.avgOutflowCFS;
          totalDays = totalDays + 1;
    
          dailyData.push(myData);
        }      
        let myData = {"day":"Totals", "avgInflowCFS":totalInflow, "lastInflowCFS":totalInflow, "manualInflowCFS":totalInflow, "avgOutflowCFS":totalOutflow, "lastOutflowCFS":totalOutflow, "manualOutflowCFS":totalManualOutflow, "orgEomContent":0, "eomContent":totalEomContent, "eomElevation":0, "index":totalDays, "manualOutFlowColor":"", "manualInFlowColor":"", "elevationWarning":"", "disabled":true};
        
        dailyData.push(myData);
    
        //console.log(dailyData);
        
        //this.allDailyData.push(dailyData);

        allDailyData[i] = dailyData;
      
      }
      //console.log(allDailyData);
      return allDailyData;

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
    
    setOperationalData = (operations: any[]): any  => {
      this.myLog.log('INFO', '-------- OperationsService.setOperationalData --------');
  
      let jsonObject:any = {"data":[]};
  
      let myObject:any = this.checkOperationalData(operations);
  
      if ( !(myObject).fatalError ) {
  
        jsonObject['title']             =  operations[0];
        jsonObject['name']              =  operations[1];
        jsonObject['forcast']           =  operations[2];
        jsonObject['date']              =  operations[3];
        jsonObject['label1']            =  operations[4];
        jsonObject['label2']            =  operations[5];
        jsonObject['label3']            =  operations[6];
        jsonObject['initialEOMContent'] =  operations[7];
        jsonObject['inflowSummary']     =  operations[32];
        jsonObject['normal']            =  operations[33];
        jsonObject['maxContent']        =  operations[34];
        
        this.startingEOM = Number(parseFloat(jsonObject['initialEOMContent'].replace(/,/g, '')));

        let baseNumber:number = 8;
        let dataNumber:number = 24;
  
        for (let i = 0; i < dataNumber; i++) {
          jsonObject.data[i] =   this.getRowArray(operations[(baseNumber + i)]);
          jsonObject.data[i].index = i;
        }

        // console.log('--- jsonObject ---');
        // console.log( jsonObject );
        // console.log( this.convertFlowUnitValues(jsonObject) );
    
        this.convertFlowUnitValues(jsonObject); 
        //this.getDailyData(jsonObject); 
        //console.log(jsonObject);
        return jsonObject;
      
    } else {
  
      this.clearOperationalData();
  
      return [];
    }
  }
}
