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
  test:any = new Array(70000,80000,90000,100000);

  getElevation(event: MouseEvent) {
    this.elevation = this.elevationService.getElevation( this.acrefeet);
    this.elevationService.getElevations(this.test);
  }
}
