import { Injectable } from '@angular/core';
import * as elevation from '../assets/taylorelevationtable.json';

@Injectable({
  providedIn: 'root',
})

export class ElevationService {
  elevationData: any = elevation;
  elevations: any = new Array();
  elevation = 0.0;
  acrefeet = 70000.0;

  constructor() {}

  getElevations(acreFeet: number[]): number[] {
    this.elevations = new Array(acreFeet.length);

    var index;
    for (index in acreFeet) {
      this.elevations[index] = this.getElevation(acreFeet[index]);
    }

    return this.elevations;
  }

  getElevation(acreFeet: number): number {
    let tabIndex = 0;
    let decIndex = 0;
    let myDecimal = 0.0;

    this.elevationData.elevationTable.forEach(function (row: any) {
      
      if (row.low < acreFeet) {
        tabIndex++;
      } else {
        return;
      }
    });

    this.elevation = this.elevationData.elevationTable[tabIndex - 1].elevation;
    
    if (acreFeet > this.elevationData.elevationTable[tabIndex - 1].max) {
      decIndex = 9;
    } else {
      this.elevationData.elevationTable[tabIndex - 1].acrefeet.forEach(function (
        row: any
      ) {
        
        if (row < acreFeet) {
          decIndex++;
        } else {
          return;
        }
      });
    }

    myDecimal =
      (acreFeet -
        this.elevationData.elevationTable[tabIndex - 1].acrefeet[
          decIndex - 1
        ]) /
      (this.elevationData.elevationTable[tabIndex - 1].acrefeet[decIndex] -
        this.elevationData.elevationTable[tabIndex - 1].acrefeet[
          decIndex - 1
        ]) /
      10;

    this.elevation =
      this.elevationData.elevationTable[tabIndex - 1].elevation +
      (decIndex - 1) * 0.1 +
      Number(myDecimal.toFixed(2));

    return this.elevation;
  }
}
