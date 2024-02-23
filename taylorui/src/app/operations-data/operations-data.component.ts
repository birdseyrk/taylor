import { Component } from '@angular/core';

import { ElevationService } from '../elevation.service';
import { OperationsService } from '../operations.service';

@Component({
  selector: 'app-operations-data',
  templateUrl: './operations-data.component.html',
  styleUrl: './operations-data.component.css'
})
export class OperationsDataComponent {

  constructor( 
    public operationsService: OperationsService, public elevationService: ElevationService) { }

    //TODO put elevation service in operations, change calls to call operations.

    myData:any = [];
    startingEOMContent:number = 0.0;
    eomContentLabel:string = '';

    getElevation(acrefeet:number):number {
      console.log('-------- OperationsService.getElevation --------');

      return this.elevationService.getElevation(acrefeet);
    }

    getElevations(eomContent:number[]):number[] {
      console.log('-------- OperationsService.getElevations --------');

      return this.elevationService.getElevations(eomContent);
    }

    getEOMContent(baseContent:number, inflow:number, outflow:number):number {
      console.log('-------- OperationsService.getEOMContent -------- ' + baseContent + ' ' + inflow + ' ' + outflow);

      return baseContent + inflow - outflow;

    }

    setEOMContent(baseContent:number, inflow:number, outflow:number):number {
      console.log('-------- OperationsService.setEOMContent -------- ' + baseContent + ' ' + inflow + ' ' + outflow);

      return this.getEOMContent(baseContent, inflow, outflow);

    }

    getEOMContentList(data:any):number[] {
      console.log('-------- OperationsService.getEOMContentList --------');

      let eomContent = new Array();
      
      let myEomContent = 0;

      eomContent =[];

      for (let i = 0; i < data.length; i++) {
        
        myEomContent = (this.startingEOMContent + data[i].inflow -data[i].outflow); 
        eomContent.push(myEomContent);
      }
        
      console.log(eomContent);

      return eomContent;
    }

    setEOMContentList(data:any, baseContent:number) {
      console.log('-------- OperationsService.setEOMContentList --------');

      let baseEOM = 0;

      for (let i = 0; i < data.length; i++) {
        
        //console.log(i + ' ' + data[i].eomContent + ' ' + data[i].inflow + ' ' + data[i].outflow);

        if ( i === 0 ) {
          baseEOM = this.startingEOMContent;
        } else {
          baseEOM = data[(i-1)].eomContent;
        }

        let myEOM = this.setEOMContent( baseEOM, data[i].inflow, data[i].outflow);
        data[i].eomContent = myEOM;
        //console.log(i + ' ' + data[i].eomContent + ' ' + data[i].inflow + ' ' + data[i].outflow);

      }

    }

    getMyData(event: MouseEvent) {
      console.log('-------- OperationsService.getMyData --------');

      this.startingEOMContent = 0.0;
      let temp:any = this.operationsService.getJson();

      //const obj = JSON.parse(temp);

      //if (temp.length > 2) {
      if (temp) {
  
        //this.myData = obj.data;
        this.myData = temp.data;

        this.startingEOMContent = parseInt( temp.initialAcreFeet.replace(',','')); 
        //this.startingEOMContent = parseInt( obj.initialAcreFeet.replace(',','')); 
  
        this.eomContentLabel = "EOM Content " +  this.startingEOMContent + " elevation " + this.getElevation( this.startingEOMContent).toFixed(2);

        this.setEOMContentList(this.myData, this.startingEOMContent);

      }
  
    }

}
