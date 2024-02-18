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
  
  getElevation() {
    console.log("----------ElevationComponent - getElevation [" + this.acrefeet + "] ----------");
    console.log(this.elevationData.elevationTable)

  }
  
}
