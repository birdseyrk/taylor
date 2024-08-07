import { Component } from '@angular/core';
// import { InputNumberInputEvent } from 'primeng/inputnumber';

import { ElevationService } from '../elevation.service';

@Component({
  selector: 'app-elevation',
  templateUrl: './elevation.component.html',
  styleUrl: './elevation.component.css'
})

export class ElevationComponent {

  constructor( 
    public elevationService: ElevationService) { }

  acrefeet   = 0.0;
  elevation = 0.0;

  acrefeet2   = 0.0;
  cubicfeet2 = 0.0;

  acrefeet3   = 0.0;
  cubicfeet3  = 0.0;

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
}
