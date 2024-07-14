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

    console.log(acreFeet);

    this.elevationData.elevationTable.forEach(function (row: any) {
      
      if (row.low < acreFeet) {
        tabIndex++;
      } else {
        return;
      }
    });

    console.log(tabIndex);

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

getCubicFeet(acreFeet: number): number {
  let cubicFeet:number = 0;
  cubicFeet = acreFeet * 43560.000443512;
  return cubicFeet;
}

getAcreFeet(cubicFeet: number): number {
  let acreFeet:number = 0;
  acreFeet = cubicFeet * .000022956840904921; //.0000229568;  .000022956840904921
  return acreFeet;
}

//https://www.unitconverters.net/volume/acre-foot-to-cubic-foot.htm
// 1 ac*ft = 43560 ft^3
// 1 ft^3 = 2.29568E-5 ac*ft

// Example: convert 15 ac*ft to ft^3:
// 15 ac*ft = 15 × 43560 ft^3 = 653400 ft^3

//https://www.unitconverters.net/volume/cubic-foot-to-acre-foot.htm 
// 1 ft^3 = 2.29568E-5 ac*ft
// 1 ac*ft = 43560 ft^3

// Example: convert 15 ft^3 to ac*ft:
// 15 ft^3 = 15 × 2.29568E-5 ac*ft = 0.0003443526 ac*ft
}
