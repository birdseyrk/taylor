import { Injectable } from '@angular/core';
import * as elevation from '../assets/taylorelevationtable.json';

import * as constants from '../constants';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})

export class ElevationService {
  elevationData: any = elevation;
  elevations: any = new Array();
  elevation:number = 0.0;
  acrefeet:number = 70000.0;

  constructor(
    private myLog: LoggingService) {}

  getElevations(acreFeet: number[]): number[] {
    this.elevations = new Array(acreFeet.length);

    var index;
    for (index in acreFeet) {
      this.elevations[index] = this.getElevation(acreFeet[index]);
    }

    return this.elevations;
  }

  getElevation(acreFeet: number): number {
    //console.log("--------------- getElevation ---------------");
    let tabIndex = 0;
    let decIndex = 0;
    let myDecimal = 0.0;

   // console.log("acreFeet " + acreFeet);

    this.elevationData.elevationTable.forEach(function (row: any) {
      
      if (row.low < acreFeet) {
        tabIndex++;
      } else {
        return;
      }
    });

    //console.log("tabIndex " + tabIndex);

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

    //console.log("caclulated acreFeet " + acreFeet + " elevation " + this.elevation);
    return this.elevation;
  }

  getElevationWarning(elevation: number): any {
    this.myLog.log(
      'INFO',
      '-------- OperationsDataComponent.getElevationWarning --------'
    );

    let warning = '';

    if (elevation > constants.MAX_ELEVATION_LEVEL) {
      warning = constants.EOM_MAX_LEVEL;
    } else if (elevation > constants.WARNING_ELEVATION_LEVEL) {
      warning = constants.EOM_WARNING_LEVEL;
    }

    //console.log("return warning elevation " + elevation + " warning [" + warning + "]");
    return warning;
  }

getCubicFeet(acreFeet: number): number {
  let cubicFeet:number = 0;
  cubicFeet = acreFeet * 43560.000443512;

  return cubicFeet;
}

getAvgCubicFeetPerSecond(acreFeet: number, days: number): number {
  let avgCubicFeet:number = 0;
  let seconds = 60;
  let minutes = 60;
  let hours   = 24;
  avgCubicFeet = (acreFeet * 43560.000443512) / (seconds * minutes * hours * days);

  return avgCubicFeet;
}

getAcreFeet(cubicFeet: number): number {
  let acreFeet:number = 0;
  acreFeet = cubicFeet * .000022956840904921; //.0000229568;  .000022956840904921
  return acreFeet;
}

getAcreFeetFromCFS(cfs: number): number {
  let acreFeet:number = 0;
  acreFeet = cfs * 1.982113483915127;
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
