import { Component } from '@angular/core';

import { OperationsService } from '../operations.service';

@Component({
  selector: 'app-operations-data',
  templateUrl: './operations-data.component.html',
  styleUrl: './operations-data.component.css'
})
export class OperationsDataComponent {

  constructor( 
    public operationsService: OperationsService) { }

    myData:any = [];

    getMyData(event: MouseEvent) {
      let temp:any = this.operationsService.getJson();

      const obj = JSON.parse(temp)
      console.log(obj.data);

      this.myData = obj.data;
    }

}
