import { Component } from '@angular/core';

import { ElevationService } from '../elevation.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.css'
})
export class ToolsComponent {

  constructor( 
    public elevationService: ElevationService) { }

  days        = 1;
  acrefeet    = 0.0;
  elevation   = 0.0;

  acrefeet2   = 0.0;
  cubicfeet2  = 0.0;

  acrefeet3   = 0.0;
  cubicfeet3  = 0.0;

  acrefeet4   = 0.0;
  cubicfeet4  = 0.0;

  acrefeet5   = 0.0;
  cubicfeet5  = 0.0;

  test:any = new Array(70000,80000,90000,100000);

  getElevation(myAcrefeet:any) {
    this.elevation = this.elevationService.getElevation(myAcrefeet);
  }

  getCubicFeet(myAcreFeet:number) {
    this.cubicfeet2 = this.elevationService.getCubicFeet(myAcreFeet);
  }

  getAcreFeet(myCubicFeet:number) {
    this.acrefeet3 = this.elevationService.getAcreFeet(myCubicFeet);
  }

  getAcreFeetFromCubicFeetPerSecond(cfs:number) {
    console.log("getAcreFeetFromCubicFeetPerSecond " + cfs);
    this.acrefeet4 = this.elevationService.getAcreFeetFromCFS(cfs);
  }

  getCFSfromAFPerDay(myAcrefeet:number, days:number) {  
    console.log("getCFSfromAFPerDay " + myAcrefeet + " days " + days);
    this.cubicfeet5 = this.elevationService.getCFSfromAFPerDay(( myAcrefeet/days) );
  }

}
