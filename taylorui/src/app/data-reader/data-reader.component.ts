import { Component } from '@angular/core';

import { OperationsService } from '../operations.service';

@Component({
  selector: 'app-data-reader',
  templateUrl: './data-reader.component.html',
  styleUrl: './data-reader.component.css'
})
export class DataReaderComponent {

  constructor( 
    public operationsService: OperationsService) { }

  operations: string[] = [];
  proposedOperations: any ="";

  processData(event: MouseEvent) {
    console.log('-------- DataReaderComponent.processData --------');
    if (this.proposedOperations.length > 0) {
      this.operations = this.operationsService.getOperations(this.proposedOperations);
    } else {
      console.log("proposedOperations data is empty");
      // info popup.
    }

    console.log(this.operations);
  };

}
