import { Injectable } from '@angular/core';
import * as constants from '../constants';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  constructor() {}

  // operations: any = new Array();
  myJson:string = '{}';

  getOperations(proposedOperations: any): string[] {
    console.log('-------- OperationsService.getOperations --------');

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
        //console.log('---------- ' + columnIndex + '----------');
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

    console.log("------> " + myNewRow + " <------");

    //console.log("------> " + rowJson + " <------");

    return myNewRow; //rowJson;
  }

  getJson():string {
    return this.myJson;
  }

  clearOperationalData() {
    console.log('-------- OperationsService.clearJson --------');
    this.myJson = '{}';
  }

  calculateValues(operations:any):any {
    console.log('-------- OperationsService.calculateValues -------- ');

    //const ACtoCF = 43560;
    //const secondsDay = 86400;

    //const elevationWarning    = 9327;
    //const elevationMaxWarning = 9329;
    //const warningBackground = 'yellow';
    //const maxBackground = 'red';

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

    console.log(operations);
    
    return operations;

  }

  //setOperationalData(operations: any[]): string {
  setOperationalData(operations: any[]): any {
    console.log('-------- OperationsService.setOperationalData --------');

    // for (let i = 0; i < operations.length; i++) {
    //   console.log(" index " + i + "******* " + operations[i] +  " *******");
    // }

    let jsonString = '{';
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

  }
}
