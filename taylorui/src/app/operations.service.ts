import { Injectable } from '@angular/core';
import * as constants from '../constants';
import { LoggingService } from './logging.service';
import { InputError } from './InputError';

@Injectable({
  providedIn: 'root',
})

export class OperationsService {
  constructor( 
    private myLog:LoggingService) {}
  
  myJson:string = '{}';
  errorJson:any = {"errors":[],"fatalError":false};

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

    //console.log(this.myJson);

    return operations;
  }

  getRowArray(row: any): string {
    let rowData:any = [];
    //let rowJson:any = {row:[]};
    let rowJson:any = [];
    
    rowData =  row.split(" ");

    rowJson["month"]        = rowData[0];
    rowJson["dateRange"]    = rowData[1];
    rowJson["inflow"]       =  Number(rowData[2].replace(/,/g, '')); 
    
    rowJson["avgInflow"]    =  Number(rowData[3].replace(/,/g, ''));
    rowJson["outflow"]      =  Number(rowData[4].replace(/,/g, ''));
    rowJson["avgOutflow"]   =  Number(rowData[5].replace(/,/g, ''));
    rowJson["eomContent"]   =  Number(rowData[6].replace(/,/g, ''));
    rowJson["eomElevation"] =  Number(rowData[7].replace(/,/g, ''));
    
    var mySplit1              =  rowData[1].split("-");
    rowJson["days"]           = parseInt(mySplit1[1]) - parseInt(mySplit1[0]) + 1;

    //console.log(rowJson);
    return rowJson;
  }

  getJson():string {
    return this.myJson;
  }

  getErrorsJson():string {
    return this.errorJson;
  }

  clearOperationalData() {
    this.myLog.log('INFO', '-------- OperationsService.clearJson --------');
    this.myJson = '{}';
  }

  calculateValues(operations:any):any {
    this.myLog.log('INFO', '-------- OperationsService.calculateValues -------- ');

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

      jsonObject['title']           =  operations[0];
      jsonObject['name']            =  operations[1];
      jsonObject['forcast']         =  operations[2];
      jsonObject['date']            =  operations[3];
      jsonObject['label1']          =  operations[4];
      jsonObject['label2']          =  operations[5];
      jsonObject['label3']          =  operations[6];
      jsonObject['initialAcreFeet'] =  operations[7];
      jsonObject['inflowSummary']   =  operations[32];
      jsonObject['normal']          =  operations[33];
      jsonObject['maxContent']      =  operations[34];

      jsonObject.data[0] =   this.getRowArray(operations[8]);
      jsonObject.data[1] =   this.getRowArray(operations[9]);
      jsonObject.data[2] =   this.getRowArray(operations[10]);
      jsonObject.data[3] =   this.getRowArray(operations[11]);
      jsonObject.data[4] =   this.getRowArray(operations[12]);
      jsonObject.data[5] =   this.getRowArray(operations[13]);
      jsonObject.data[6] =   this.getRowArray(operations[14]);
      jsonObject.data[7] =   this.getRowArray(operations[15]);
      jsonObject.data[8] =   this.getRowArray(operations[16]);
      jsonObject.data[9] =   this.getRowArray(operations[17]);
      jsonObject.data[10] =  this.getRowArray(operations[18]);
      jsonObject.data[11] =  this.getRowArray(operations[19]);
      jsonObject.data[12] =  this.getRowArray(operations[20]);
      jsonObject.data[13] =  this.getRowArray(operations[21]);
      jsonObject.data[14] =  this.getRowArray(operations[22]);
      jsonObject.data[15] =  this.getRowArray(operations[23]);
      jsonObject.data[16] =  this.getRowArray(operations[24]);
      jsonObject.data[17] =  this.getRowArray(operations[25]);
      jsonObject.data[18] =  this.getRowArray(operations[26]);
      jsonObject.data[19] =  this.getRowArray(operations[27]);
      jsonObject.data[20] =  this.getRowArray(operations[28]);
      jsonObject.data[21] =  this.getRowArray(operations[29]);
      jsonObject.data[22] =  this.getRowArray(operations[30]);
      jsonObject.data[23] =  this.getRowArray(operations[31]);

      jsonObject.data[0].index = 0;
      jsonObject.data[1].index = 1;
      jsonObject.data[2].index = 2;
      jsonObject.data[3].index = 3;
      jsonObject.data[4].index = 4;
      jsonObject.data[5].index = 5;
      jsonObject.data[6].index = 6;
      jsonObject.data[7].index = 7;
      jsonObject.data[8].index = 8;
      jsonObject.data[9].index = 9;
      jsonObject.data[10].index = 10;
      jsonObject.data[11].index = 11;
      jsonObject.data[12].index = 12;
      jsonObject.data[13].index = 13;
      jsonObject.data[14].index = 14;
      jsonObject.data[15].index = 15;
      jsonObject.data[16].index = 16;
      jsonObject.data[17].index = 17;
      jsonObject.data[18].index = 18;
      jsonObject.data[19].index = 19;
      jsonObject.data[20].index = 20;
      jsonObject.data[21].index = 21;
      jsonObject.data[22].index = 22;
      jsonObject.data[23].index = 23;
  
      return this.calculateValues(jsonObject); 
    
  } else {

    this.clearOperationalData();

    return [];
  }
}
}