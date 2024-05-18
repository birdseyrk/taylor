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
  
  // operations: any = new Array();
  myJson:string = '{}';

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
        //console.log(lineString.trim());
        
        this.myLog.log('INFO', '-------- OperationsService.getOperations --------');
        operations.push(lineString.trim());
        //console.log(operations[operIndex]);
        operIndex++;
        lineString = '';
      } else {
        lineString = lineString + proposedOperations[i];
      }
    }

    operations.push(lineString.trim());

    this.myJson = this.setOperationalData(operations);

    return operations;
  }
  getRowArray(row: any, index:number): string {
    let blank = 32;
    let comma = 44;
    //let rowJson = '{"month":"';
    let addComma = false;
    let columnIndex = 1;
    //let name = '';
    let myValue = '';
    let myNewRow = '';
    
   // console.log(row);

    for (let i = 0; i < row.length; i++) {
      // console.log(
      //   'i = ' +
      //     i +
      //     ' char [' +
      //     row[i] +
      //     '] str.charAt(0) is: [' +
      //     row.charCodeAt(i) +
      //     '] addComma [' +
      //     addComma +
      //     ']'
      // );

     // console.log(columnIndex);

      if (row.charCodeAt(i) === blank) {
        //this.myLog.log('INFO', '---------- ' + columnIndex + '----------');
        // if (addComma) {
        //   rowJson = rowJson + '","';
        // }

        //switch

        switch (columnIndex) {
          // case 0: {
          //   name =  '"date":"';
          //    break;
          // }
          case 1: {
            //console.log(myValue +'",dateRange":"');
            //name = '"dateRange":"';

            myNewRow = '{"index":"'+ index +'","month":"' + myValue + '",';
            myValue = '';
            break;
          }
          case 2: {
            //console.log(myValue + ',"inflow":"');
            //name = '"inflow":"';

            myNewRow = myNewRow + '"dateRange":"' + myValue + '",'; 

            var mySplit = myValue.split("-");
            //console.log("start [" + mySplit[0] + "] end [" + mySplit[1] + "] total [" +  ( parseInt(mySplit[1]) - parseInt(mySplit[0])) +"]");

            let days = parseInt(mySplit[1]) - parseInt(mySplit[0]) + 1;

            myNewRow = myNewRow + '"dateRange":"' + myValue + '","days":"' + days + '",';

            myValue = '';
            break;
          }
          case 3: {
            //console.log(myValue + ',"avgInflow":"');
            //name = '"avgInflow":"';

            myNewRow = myNewRow + '"inflow":' + myValue + ',';
            myValue = '';
            break;
          }
          case 4: {
            //console.log(myValue + ',"outflow":"');
            //name = '"outflow":"';

            myNewRow = myNewRow + '"avgInflow":' + myValue + ',';
            myValue = '';
            break;
          }
          case 5: {
            //console.log(myValue +'",avgOutflow":"' );
            //name = '"avgOutflow":"';

            myNewRow = myNewRow + '"outflow":' + myValue + ',';
            myValue = '';
            break;
          }
          case 6: {
            //console.log(myValue + '",eomContent":"');
            //name = '"eomContent":"';

            myNewRow = myNewRow + '"avgOutflow":' + myValue + ',';
            myValue = '';
            break;
          }
          case 7: {
            //console.log(myValue + '",eomElevation":"');
            //name = '"eomElevation":"';

            myNewRow = myNewRow + '"eomContent":' + myValue + ',';
            myValue = '';
            break;
          }
          default: {
            //statements;
            break;
          }
        }

        //console.log(rowJson);
        //rowJson = rowJson + '",' + name;

        //console.log(myNewRow);
        addComma = true;
        columnIndex++;

        //console.log(rowJson);
      } else if (row.charCodeAt(i) === comma) {
        // no-op
      } else {
       //rowJson = rowJson + row[i];
       myValue = myValue  + row[i];
       //console.log(myValue);
      }
    }
    //rowJson = rowJson + '"}';

    //console.log(rowJson);

    myNewRow = myNewRow + '"eomElevation":' + myValue + ',"elevationWarning":"","manualInflow":0,"inflowCF":"","avgInflowCFS":"","manualOutflow":0,"manualOutflowCFS":0,"avgOutflowCFS":"","outflowCF":""}';

    //console.log("------> " + myNewRow + " <------");

    //console.log("------> " + rowJson + " <------");

    return myNewRow; //rowJson;
  }

  getJson():string {
    return this.myJson;
  }

  clearOperationalData() {
    this.myLog.log('INFO', '-------- OperationsService.clearJson --------');
    this.myJson = '{}';
  }

  calculateValues(operations:any):any {
    this.myLog.log('INFO', '-------- OperationsService.calculateValues -------- ');

    for (let i = 0; i < operations.data.length; i++) {
      operations.data[i].inflowCF = operations.data[i].inflow   * constants.ACTOSQFT;
      operations.data[i].outflowCF = operations.data[i].outflow * constants.ACTOSQFT;
      operations.data[i].avgInflowCFS = operations.data[i].inflowCF / (operations.data[i].days * constants.SECONDSPERDAY);
      operations.data[i].avgOutflowCFS = operations.data[i].outflowCF / (operations.data[i].days * constants.SECONDSPERDAY);
  
      //TODO this is also in the elevation service need to design it so it is only one place.
      operations.data[i].elevationWarning = '';
      if (operations.data[i].eomElevation > constants.MAX_ELEVATION_LEVEL) {
        operations.data[i].elevationWarning = constants.EOM_MAX_LEVEL;
      } else if (operations.data[i].eomElevation > constants.WARNING_ELEVATION_LEVEL) {
        operations.data[i].elevationWarning = constants.EOM_WARNING_LEVEL;
      }

    }

    //console.log(operations);
    
    return operations;

  }

  checkOperationalData = (operations: any[]): string  => {
    this.myLog.log('INFO', '-------- OperationsService.checkOperationalData --------');
    let errorString:string = '{"errors":[';
    let errorJson:any = {"errors":[],"fatalError":false};
    let errorJsonRow:any = {"row":0, "error": "", "errorFatal":false};
    let fatalError = false;
    let myComma = '';
    console.log(errorJson);
    console.log("*** input data ***");
    console.log(operations);
    console.log("*** input data ***");


    try {
      if (operations.length < 35) {
        this.myLog.log('ERROR', '-------- Did not copy all the data - Need 35 rows, but only got [' + operations.length + '] rows-------- ');
        errorString = '{"errors":[{"row":0, "error":"Data only contains ' + operations.length + ' there should be 35 lines", "errorFatal":true}], "fatalError":' + true +  '}';
        let mystring = '"Data only contains ' + operations.length + ' there should be 35 lines"';
        const myError = new InputError(0, mystring, true);
        // console.log("*** myError ***");
        // console.log(myError.getJson());
        // console.log("*** myError ***");

        errorJson.errors.push(myError.getJson());
        throw new Error('Not all the data was copied');
      }
      for (let i = 0; i < operations.length; i++) {
        switch (i) {
          case 0: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if  ((spaceCount != 1) || (rowLength != 18) ||  (dataSplit[0] != 'Proposed') ) {
              if ((spaceCount != 1) || (rowLength != 18)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              
              // if (dataSplit[0] != 'Proposed') {
              //   myErrorString = '{"row":' + i+1 + ", 'error':'Invalid Data', 'errorFatal':true}";
              // }
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            //console.log(errorString);
            break;
          }
          case 1: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if  ((spaceCount != 2) || (rowLength != 21) ||  (dataSplit[0] != 'Taylor') ) {
              if ((spaceCount != 2) || (rowLength != 21)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              
              // if (dataSplit[0] != 'Proposed') {
              //   myErrorString = '{"row":' + i+1 + ", 'error':'Invalid Data', 'errorFatal':true}";
              // }
              
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 2: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if  ((spaceCount != 6) ||  (dataSplit[2] != 'forecast') ) {
              
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              
              // if (dataSplit[0] != 'Proposed') {
              //   myErrorString = '{"row":' + i+1 + ", 'error':'Invalid Data', 'errorFatal':true}";
              // }
              
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 3: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if  ((spaceCount != 2)  ) {
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 4: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if  ((spaceCount != 3) || (rowLength != 23) ||  (dataSplit[0] != 'Average') ) {
              if ((spaceCount != 3) || (rowLength != 23)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              
              // if (dataSplit[0] != 'Proposed') {
              //   myErrorString = '{"row":' + i+1 + ", 'error':'Invalid Data', 'errorFatal':true}";
              // }
              
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 5: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if  ((spaceCount != 5) || (rowLength != 47) ||  (dataSplit[0] != 'Inflow') ) {
              if ((spaceCount != 4) || (rowLength != 47)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              
              // if (dataSplit[0] != 'Proposed') {
              //   myErrorString = '{"row":' + i+1 + ", 'error':'Invalid Data', 'errorFatal':true}";
              // }
              
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 6: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 6) || (rowLength != 34) ||  (dataSplit[0] != 'Month') ) {
              if ((spaceCount != 6) || (rowLength != 34)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              
              // if (dataSplit[0] != 'Proposed') {
              //   myErrorString = '{"row":' + i+1 + ", 'error':'Invalid Data', 'errorFatal':true}";
              // }
              
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 7: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
            if (rowLength < 1)   {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            break;
          }
          case 8: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Nov')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }

            break;
          }
          case 9: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Nov')  ||  (dataSplit[1] != '16-30')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 10: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Dec')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 11: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Dec')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 12: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jan')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 13: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jan')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 14: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Feb')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 15: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Feb')  ||  (dataSplit[1] != '16-28')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }

            break;
          }
          case 16: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Mar')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 17: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Mar')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }

            break;
          }
          case 18: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Apr')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 19: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Apr')  ||  (dataSplit[1] != '16-30')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 20: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'May')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 21: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'May')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");
            }
            
            break;
          }
          case 22: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jun')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 23: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jun')  ||  (dataSplit[1] != '16-30')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 24: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jul')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 25: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Jul')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 26: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Aug')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 27: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Aug')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 28: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Sep')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 29: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Sep')  ||  (dataSplit[1] != '16-30')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 30: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Oct')  ||  (dataSplit[1] != '1-15')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 31: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 7) ||  (dataSplit[0] != 'Oct')  ||  (dataSplit[1] != '16-31')) {
              fatalError = true;
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":true, "line":"' + operations[i] +'"}';
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, true);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 32: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 3) || (rowLength != 26) ||  (dataSplit[3] != 'inflow') ) {
              if ((spaceCount != 6) || (rowLength != 34)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            
            break;
          }
          case 33: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 2) || (rowLength != 14) ||  (dataSplit[2] != 'normal') ) {
              if ((spaceCount != 6) || (rowLength != 34)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }

            break;
          }
          case 34: {
            let dataSplit = operations[i].split(" ");
            let spaceCount = ( operations[i].split(" ").length - 1);
            let rowLength = operations[i].length;
            let myErrorString = '';
            console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
            console.log(dataSplit);
           
            if  ((spaceCount != 3) || (rowLength != 25) ||  (dataSplit[3] != 'Content') ) {
              if ((spaceCount != 3) || (rowLength != 25)) {
                myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data", "errorFatal":false, "line":"' + operations[i] +'"}';
              }
              errorString = errorString + myComma + myErrorString;
              myComma = ', ';
              console.log("*** " + i + " ***");

              let mystring = 'line ' + (i+1) + ' Invalid Row Data. line: line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }

            break;
          }
        default : {
          let dataSplit = operations[i].split(" ");
          let spaceCount = ( operations[i].split(" ").length - 1);
          let rowLength = operations[i].length;
          let myErrorString = '';
          console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
          console.log(dataSplit);
         
          if  ((spaceCount != 3) || (rowLength != 25) ||  (dataSplit[3] != 'Content') ) {
            if ((spaceCount != 3) || (rowLength != 25)) {
              myErrorString = '{"row":' + i + ', "line":' + (i+1) + ', "error":"Invalid Row Data - extra-row", "errorFatal":false, "line":"' + operations[i] +'"}';

              let mystring = 'line ' + (i+1) + ' Invalid Row Data - extra-row. line: ' + operations[i];
              const myError = new InputError(i, mystring, false);
              console.log("*** myError ***");
              console.log(myError.getJson());
              console.log("*** myError ***");

              errorJson.errors.push(myError.getJson());
            }
            errorString = errorString + myComma + myErrorString;
            myComma = ', ';
          }

        }
          // case 35: {
          //   let dataSplit = operations[i].split(" ");
          //   let spaceCount = ( operations[i].split(" ").length - 1);
          //   let rowLength = operations[i].length;
          //   let myErrorString = '';
          //   console.log(i + ' ' + operations[i].length + ' ' + ( operations[i].split(" ").length - 1) + ' ' + operations[i]);
          //   console.log(dataSplit);
          //   break;
          // }
        }
      }
      errorString = errorString + "],"+'"fatalError":'+ fatalError+"}";
      console.log(errorString);


    } catch (e) {
      //console.error(`${e.name}: ${e.message}`);
      
      console.log(errorString);
      //this.myLog.log('ERROR', '-------- OperationsService.checkOperationalData --------');
      
      console.log("*** errorString 1 ***");
      console.log(errorString);
      console.log("*** errorString 1 ***");
      
      console.log("*** errorJson 1 ***");
      errorJson["fatalError"] = fatalError;
      console.log(errorJson);
      console.log("*** errorJson 1 ***");

     //return  (JSON.parse(errorString));
     return errorJson;
    }


  console.log("*** errorString 2 ***");
  console.log( (JSON.parse(errorString)) );
  console.log("*** errorString 2 ***");
  
  errorJson["fatalError"] = fatalError;
      
  console.log("*** errorJson 2 ***");
  
  errorJson["fatalError"] = fatalError;
  console.log(errorJson);
  console.log("*** errorJson 2 ***");

    //return  (JSON.parse(errorString));
    return errorJson;
  }

  //setOperationalData(operations: any[]): string {
  setOperationalData = (operations: any[]): any  => {
    this.myLog.log('INFO', '-------- OperationsService.setOperationalData --------');

    let jsonString = '{}'
    // for (let i = 0; i < operations.length; i++) {
    //   console.log(" index " + i + "******* " + operations[i] +  " *******");
    // }

    //let myObject:any = {"fatalError": false};
    let myObject:any = this.checkOperationalData(operations);

    if ( !(myObject).fatalError ) {
      console.log("*** checkOperationalData - good ***");

      jsonString = '{';
      jsonString = jsonString + '"title":' + '"' + operations[0] + '",';
      jsonString = jsonString + '"name":' + '"' + operations[1] + '",';
      jsonString = jsonString + '"forcast":' + '"' + operations[2] + '",';
      jsonString = jsonString + '"date":' + '"' + operations[3] + '",';
      jsonString = jsonString + '"label1":' + '"' + operations[4] + '",';
      jsonString = jsonString + '"label2":' + '"' + operations[5] + '",';
      jsonString = jsonString + '"label3":' + '"' + operations[6] + '",';
      jsonString = jsonString + '"initialAcreFeet":' + '"' + operations[7] + '",';
      jsonString = jsonString + '"data":[';
      jsonString = jsonString + this.getRowArray(operations[8],  0) + ',';
      jsonString = jsonString + this.getRowArray(operations[9],  1) + ',';
      jsonString = jsonString + this.getRowArray(operations[10], 2) + ',';
      jsonString = jsonString + this.getRowArray(operations[11], 3) + ',';
      jsonString = jsonString + this.getRowArray(operations[12], 4) + ',';
      jsonString = jsonString + this.getRowArray(operations[13], 5) + ',';
      jsonString = jsonString + this.getRowArray(operations[14], 6) + ',';
      jsonString = jsonString + this.getRowArray(operations[15], 7) + ',';
      jsonString = jsonString + this.getRowArray(operations[16], 8) + ',';
      jsonString = jsonString + this.getRowArray(operations[17], 9) + ',';
      jsonString = jsonString + this.getRowArray(operations[18], 10) + ',';
      jsonString = jsonString + this.getRowArray(operations[19], 11) + ',';
      jsonString = jsonString + this.getRowArray(operations[20], 12) + ',';
      jsonString = jsonString + this.getRowArray(operations[21], 13) + ',';
      jsonString = jsonString + this.getRowArray(operations[22], 14) + ',';
      jsonString = jsonString + this.getRowArray(operations[23], 15) + ',';
      jsonString = jsonString + this.getRowArray(operations[24], 16) + ',';
      jsonString = jsonString + this.getRowArray(operations[25], 17) + ',';
      jsonString = jsonString + this.getRowArray(operations[26], 18) + ',';
      jsonString = jsonString + this.getRowArray(operations[27], 19) + ',';
      jsonString = jsonString + this.getRowArray(operations[28], 20) + ',';
      jsonString = jsonString + this.getRowArray(operations[29], 21) + ',';
      jsonString = jsonString + this.getRowArray(operations[30], 22) + ',';
      jsonString = jsonString + this.getRowArray(operations[31], 23) + '],';
      jsonString = jsonString + '"inflowSummary":' + '"' + operations[32] + '",';
      jsonString = jsonString + '"normal":' + '"' + operations[33] + '",';
      jsonString = jsonString + '"maxContent":' + '"' + operations[34] + '"';
  
      jsonString = jsonString + '}';
  
      console.log(jsonString);
      //return jsonString;
  
      return this.calculateValues(JSON.parse(jsonString)); 
    

  } else {
    // raise pop up error.
    console.log("*** Else Part of Check operations ***");
    this.clearOperationalData();

    return [];
  }
}
}