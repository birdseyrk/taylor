import { Component } from '@angular/core';
import { InputNumberInputEvent } from 'primeng/inputnumber';

@Component({
  selector: 'app-elevation',
  templateUrl: './elevation.component.html',
  styleUrl: './elevation.component.css'
})
export class ElevationComponent {

  acrefeet = 70000.0;

  getElevation(event: MouseEvent) {
    console.log("getElevation " + this.acrefeet);
    //console.log(event.valueOf);
  }

}
