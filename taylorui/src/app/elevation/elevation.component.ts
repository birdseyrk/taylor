import { Component } from '@angular/core';
import { InputNumberInputEvent } from 'primeng/inputnumber';

import { ElevationService } from '../elevation.service';

@Component({
  selector: 'app-elevation',
  templateUrl: './elevation.component.html',
  styleUrl: './elevation.component.css'
})
export class ElevationComponent {

  constructor( 
    public elevationService: ElevationService) { }

  acrefeet   = 70000.0;
  elevation = 0.0;
  

  getElevation(event: MouseEvent) {
    console.log("getElevation " + this.acrefeet);
    console.log(this.elevationService.getElevation( this.acrefeet));
    this.elevation = this.elevationService.getElevation( this.acrefeet);
  }

}
