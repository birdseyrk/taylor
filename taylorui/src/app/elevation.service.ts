import { Injectable } from '@angular/core';
import * as elevation from '../../../assets/taylorelevationtable.json';

@Injectable({
  providedIn: 'root'
})
export class ElevationService {

  elevationData: any = elevation;
  elevation = 0.0;
  acrefeet = 70000.0;

  constructor() { }
  
  getElevation(acreFeet: number): number {

    let tabIndex = 0;
    let decIndex = 0;
    let myDecimal = 0.0;

    // console.log("----------ElevationComponent - getElevation [" + this.acrefeet + "] ----------");
    // console.log(this.elevationData.elevationTable)
    // console.log(this.elevationData.elevationTable.length);


    this.elevationData.elevationTable.forEach(function (row:any) {
      //console.log(row.low);
      if (row.low < acreFeet ) {
        tabIndex++;
      } else {
        return;
      }
    });

    this.elevation = this.elevationData.elevationTable[(tabIndex-1)].elevation;

    this.elevationData.elevationTable[(tabIndex-1)].acrefeet.forEach(function (row:any) {
      //console.log(row);

      if (row < acreFeet ) {
        decIndex++;
      } else {
        return;
      }
    });

    myDecimal = (acreFeet - this.elevationData.elevationTable[(tabIndex-1)].acrefeet[(decIndex-1)]) / (this.elevationData.elevationTable[(tabIndex-1)].acrefeet[(decIndex)] - this.elevationData.elevationTable[(tabIndex-1)].acrefeet[(decIndex-1)]) / 10;

    //console.log(myDecimal.toFixed(2));

    this.elevation = this.elevationData.elevationTable[(tabIndex-1)].elevation + (decIndex-1) * 0.1 + Number(myDecimal.toFixed(2));
    //console.log(this.elevationData.elevationTable[(tabIndex-1)]);

    return this.elevation;

  }

}
