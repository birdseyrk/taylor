import { Component } from '@angular/core';
import * as elevation from '../../assets/taylorelevationtable.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taylorui';
  elevationData: any = elevation;

  ngOnInit() {
    console.log('Data', this.elevationData.elevationTable);
  }
}
