import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  constructor() {}

  // operations: any = new Array();
  myJson:string = '{}';

  getOperations(proposedOperations: any): string[] {
    let operations: any = new Array();
    let operIndex = 0;
    let newLineChar = 10;
    let lineString = '';

    for (let i = 0; i < proposedOperations.length; i++) {
      console.log(
        'i = ' +
          i +
          ' char [' +
          proposedOperations[i] +
          '] str.charAt(0) is: [' +
          proposedOperations.charCodeAt(i) +
          ']'
      );

      if (proposedOperations.charCodeAt(i) === newLineChar) {
        console.log(lineString.trim());
        operations.push(lineString.trim());
        console.log(operations[operIndex]);
        operIndex++;
        lineString = '';
      } else {
        lineString = lineString + proposedOperations[i];
      }
    }

    operations.push(lineString.trim());

    this.myJson = this.setJson(operations);

    return operations;
  }
  getRowArray(row: any): string {
    let blank = 32;
    let comma = 44;
    let rowJson = '{"month":"';
    let addComma = false;
    let columnIndex = 1;
    let name = '';

    for (let i = 0; i < row.length; i++) {
      console.log(
        'i = ' +
          i +
          ' char [' +
          row[i] +
          '] str.charAt(0) is: [' +
          row.charCodeAt(i) +
          '] addComma [' +
          addComma +
          ']'
      );

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
            name = '"dateRange":"';
            break;
          }
          case 2: {
            name = '"inflow":"';
            break;
          }
          case 3: {
            name = '"avgInflow":"';
            break;
          }
          case 4: {
            name = '"outFlow":"';
            break;
          }
          case 5: {
            name = '"avgOutFlow":"';
            break;
          }
          case 6: {
            name = '"eomContent":"';
            break;
          }
          case 7: {
            name = '"eomElevation":"';
            break;
          }
          default: {
            //statements;
            break;
          }
        }

        //console.log(rowJson);
        rowJson = rowJson + '",' + name;
        addComma = true;
        columnIndex++;

        //console.log(rowJson);
      } else if (row.charCodeAt(i) === comma) {
        // no-op
      } else {
        rowJson = rowJson + row[i];
      }
    }
    rowJson = rowJson + '"}';

    console.log(rowJson);

    return rowJson;
  }

  getJson():string {
    return this.myJson;
  }

  setJson(operations: any[]): string {

    for (let i = 0; i < operations.length; i++) {
      console.log(" index " + i + "******* " + operations[i] +  " *******");
    }

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
    jsonString = jsonString + this.getRowArray(operations[8]) + ',';
    jsonString = jsonString + this.getRowArray(operations[9]) + ',';
    jsonString = jsonString + this.getRowArray(operations[10]) + ',';
    jsonString = jsonString + this.getRowArray(operations[11]) + ',';
    jsonString = jsonString + this.getRowArray(operations[12]) + ',';
    jsonString = jsonString + this.getRowArray(operations[13]) + ',';
    jsonString = jsonString + this.getRowArray(operations[14]) + ',';
    jsonString = jsonString + this.getRowArray(operations[15]) + ',';
    jsonString = jsonString + this.getRowArray(operations[16]) + ',';
    jsonString = jsonString + this.getRowArray(operations[17]) + ',';
    jsonString = jsonString + this.getRowArray(operations[18]) + ',';
    jsonString = jsonString + this.getRowArray(operations[19]) + ',';
    jsonString = jsonString + this.getRowArray(operations[20]) + ',';
    jsonString = jsonString + this.getRowArray(operations[21]) + ',';
    jsonString = jsonString + this.getRowArray(operations[22]) + ',';
    jsonString = jsonString + this.getRowArray(operations[23]) + ',';
    jsonString = jsonString + this.getRowArray(operations[24]) + ',';
    jsonString = jsonString + this.getRowArray(operations[25]) + ',';
    jsonString = jsonString + this.getRowArray(operations[26]) + ',';
    jsonString = jsonString + this.getRowArray(operations[27]) + ',';
    jsonString = jsonString + this.getRowArray(operations[28]) + ',';
    jsonString = jsonString + this.getRowArray(operations[29]) + ',';
    jsonString = jsonString + this.getRowArray(operations[30]) + ',';
    jsonString = jsonString + this.getRowArray(operations[31]) + '],';
    jsonString = jsonString + '"inflowSummary":' + '"' + operations[32] + '",';
    jsonString = jsonString + '"normal":' + '"' + operations[33] + '",';
    jsonString = jsonString + '"maxContent":' + '"' + operations[34] + '"';

    jsonString = jsonString + '}';

    console.log(jsonString);
    return jsonString;
  }
}
