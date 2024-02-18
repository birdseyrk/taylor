import { Component } from '@angular/core';
import * as elevation from '../../../assets/taylorelevationtable.json';

@Component({
  selector: 'app-elevation',
  templateUrl: './elevation.component.html',
  styleUrls: ['./elevation.component.scss']
})
export class ElevationComponent {

  elevationData: any = elevation;
  elevation = 0.0;
  acrefeet = 70000.0;

  ngOnInit() {
    console.log("----------  ElevationComponent  ngOnInit ----------");
  }

  getElevation() {
    //console.log("----------ElevationComponent - getElevation [" + this.host + "] ----------");

    // if ( (typeof this.host !== 'undefined') && (this.host.length > 1)) {
    //   this.server = this.serverService.getServer(this.host);
    //   console.log(this.server);
    // }

  }

}
