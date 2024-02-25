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

    elevationWarning:number    = 9327;
    elevationMaxWarning:number = 9329;
    warningBackground = 'yellow'; 
    maxBackground = 'LightCoral';
    elevationGridTitle = 'Taylor Park Reservior Level';
    elevationGridYLabel = 'Water Elevation (ft)'
    elevationGridXLabel = 'Months'



    operationsData:any;
    operationMonthlyData:any = [];
    startingEOMContent:number = 0.0;
    eomContentLabel:string = '';

    operations: string[] = [];
    proposedOperations: any = "";

    elevationGridData:any = "";
    // elevationWarningData:any = "";
    // elevationMaxData:any = "";
    // elevationAdjustedData:any = "";
    elevationGridOptions:any = "";

    dataDialogVisible = false;
    elevationVisible  = false;

    // getElevation(acrefeet:number):number {
    //   console.log('-------- OperationsDataComponent.getElevation --------');
    //   //TODO where do i put this combone the two
    //   return this.elevationService.getElevation(acrefeet);
    // }

    // getElevations(eomContent:number[]):number[] {
    //   console.log('-------- OperationsDataComponent.getElevations --------');

    //   return this.elevationService.getElevations(eomContent);
    // }

    showDataDialog() {
      this.dataDialogVisible = !this.dataDialogVisible;
    }

    showElevationDialog() {
      this.elevationVisible = !this.elevationVisible;
    }

    addToGridElevation() {
      console.log('-------- OperationsDataComponent.addToGridElevation --------');

      //https://htmlcolorcodes.com/color-names/
      //BlueViolet	  #8A2BE2	rgb(138, 43, 226)
      //MediumPurple	#9370DB	rgb(147, 112, 219)  //TODO all colres to constants
      //The fourth value denotes alpha and needs to be between 0.0 (absolute transparency) and 1.0 (absolute opacity). For example, 0.5 would be 50% opacity and 50% transparency.

      let myModifiedData:any = [];
      

      let myAdjustedLevel = '{"data":[],"backgroundColor":"rgb(147, 112, 219, .5)","fill":false,"borderColor":"rgb(138, 43, 226)","tension":".4","label":"Adjusted Water Elevation"}';
      let elevationAdjustedData = JSON.parse(myAdjustedLevel);

      console.log(elevationAdjustedData);

      for (let i = 0; i < this.operationMonthlyData.length; i++) {
        myModifiedData[i] = this.operationMonthlyData[i].eomElevation;
      }

      
      elevationAdjustedData.data =  myModifiedData;

      this.elevationGridData.datasets[3] = elevationAdjustedData;  //TODO mayb all of these need to be local not global

    }

    getElevationGridData() {
      console.log('-------- OperationsDataComponent.getElevationGridData --------');

      //https://htmlcolorcodes.com/color-names/
      //Yellow	        #FFFF00	rgb(255, 255, 0)
      //LightYellow	    #FFFFE0	rgb(255, 255, 224)
      //CornflowerBlue	#6495ED	rgb(100, 149, 237)
      //Blue	          #0000FF	rgb(0, 0, 255)
      //Salmon	        #FA8072	rgb(250, 128, 114)
      //Red	            #FF0000	rgb(255, 0, 0)
      //The fourth value denotes alpha and needs to be between 0.0 (absolute transparency) and 1.0 (absolute opacity). For example, 0.5 would be 50% opacity and 50% transparency.


      let myJSONstring    = '{"datasets":[],"labels":[]}';
      let myProposedLevel = '{"data":[],"backgroundColor":"rgb(100, 149, 237, .5)","fill":true,"borderColor":"rgb(0, 0, 255, .5)","tension":".4","label":"Proposed Water Elevation"}';
      let myWarningLevel  = '{"data":[],"backgroundColor":"rgb(255, 255, 224)","borderDash": [5, 5],"fill":false,"borderColor":"rgb(255, 255, 0)","tension":".4","label":"Warning Water Elevation"}';
      let myMaxLevel      = '{"data":[],"backgroundColor":"rgb(250, 128, 114)","borderDash": [5, 5],"fill":false,"borderColor":"rgb(255, 0, 0)","tension":".4","label":"Max Water Elevation"}';
      
      let myProposedData:any = [];
      let myLabels:any = [];
      let myWarning:any = [];
      let myMax:any = [];

      this.elevationGridData = JSON.parse(myJSONstring);
      let elevationProposedData = JSON.parse(myProposedLevel);
      let elevationWarningData = JSON.parse(myWarningLevel);
      let elevationMaxData = JSON.parse(myMaxLevel);

      console.log( this.elevationGridData );

      for (let i = 0; i < this.operationMonthlyData.length; i++) {
        myProposedData[i] = this.operationMonthlyData[i].eomElevation;
        myLabels[i] = this.operationMonthlyData[i].month + ' ' + this.operationMonthlyData[i].dateRange;
        myWarning[i] = 9327; //TODO use constant value
        myMax[i] = 9329; //TODO use constant value
      }

      elevationProposedData.data = myProposedData;
      elevationWarningData.data =  myWarning;
      elevationMaxData.data =  myMax;


      this.elevationGridData.datasets[0] = elevationWarningData;
      this.elevationGridData.datasets[1] = elevationMaxData;
      this.elevationGridData.datasets[2] = elevationProposedData;
      this.elevationGridData.labels = myLabels;

      console.log( this.elevationGridData );

      this.elevationGridOptions = { 
        plugins: { 
            legend: { 
                labels: { 
                    color: '#495057' 
                } 
            } 
        }, 
        scales: { 
            r: { 
                grid: { 
                    color: '#ebedef' 
                } 
            } 
        } 
      } 

    }
  
    processData(event: MouseEvent) {
      console.log('-------- OperationsDataComponent.processData --------');
      if (this.proposedOperations.length > 0) {
        this.operations = this.operationsService.getOperations(this.proposedOperations);
      } else {
        console.log("proposedOperations data is empty");
      }
  
      console.log(this.operations);
      this.showDataDialog();
      this.getOperationData();

    };

    getEOMContent(baseContent:number, inflow:number, outflow:number):number {
      console.log('-------- OperationsDataComponent.getEOMContent -------- ' + baseContent + ' ' + inflow + ' ' + outflow);

      return baseContent + inflow - outflow;

    }

    setEOMContent(baseContent:number, inflow:number, outflow:number):number {
      console.log('-------- OperationsDataComponent.setEOMContent -------- ' + baseContent + ' ' + inflow + ' ' + outflow);

      return this.getEOMContent(baseContent, inflow, outflow);

    }

    getElevationWarning(elevation:number):any {
      console.log('-------- OperationsDataComponent.getElevationWarning --------');

        let warning = '';
        if (elevation > this.elevationMaxWarning) {
          warning = this.maxBackground;
        } else if (elevation > this.elevationWarning) {
          warning = this.warningBackground;
        }

        return warning;
    }

    recalculateEOM(inputData:any) {
      console.log('-------- OperationsDataComponent.recalculateEOM -------- ' + inputData.index + ' ' + inputData.manualInflow);
      //console.log(inputData);
      
      let myEomContent = 0;
      let myInflow = Number(inputData.manualInflow);
      let myOutflow  = Number(inputData.manualOutflow);
      let myIndex  = Number(inputData.index);

     // console.log(this.operationMonthlyData);


      if (myInflow > 0){
        this.operationMonthlyData[Number(inputData.index)].manualInflow = myInflow;
      }
      if (myOutflow > 0){
        this.operationMonthlyData[Number(inputData.index)].manualOutflow = myOutflow;
      }

      // if  (myIndex === 0 ) {

      //   console.log('-------- 0 --------');

      //   myEomContent = this.startingEOMContent;

      // } else {

      //   console.log('-------- Not 0 --------');

      //   myEomContent = this.operationMonthlyData[(myIndex-1)].eomContent;
      // }
      
      //this.operationMonthlyData[Number(inputData.index)].eomContent = myEomContent + myInflow - myOutflow;
    

      for (let i = (Number(inputData.index) ); i < this.operationMonthlyData.length; i++) {

        //console.log(typeof i + ' ' + i);
        //console.log(this.operationMonthlyData[i]);


        if  (i === 0 ) {

          //console.log('-------- 0 --------');

          myEomContent = this.startingEOMContent;

        } else {

         // console.log('-------- Not 0 --------');

          myEomContent = this.operationMonthlyData[(i-1)].eomContent;
        }

        //console.log( i + ' myEomContent ' + typeof myEomContent+ ' ' + myEomContent);

        //this.operationMonthlyData[i].eomContent = myEomContent + myInflow - myOutflow;

        //console.log(' man inflow ' + this.operationMonthlyData[i].manualInflow + ' man outflow ' + this.operationMonthlyData[i].manualOutflow + ' eom Content ' + this.operationMonthlyData[i].eomContent);
        //console.log(' inflow ' + typeof this.operationMonthlyData[i].inflow + '  outflow ' + typeof this.operationMonthlyData[i].outflow + ' eom Content ' + typeof this.operationMonthlyData[i].eomContent);
        //console.log(' man inflow ' + typeof this.operationMonthlyData[i].manualInflow + ' man outflow ' + typeof this.operationMonthlyData[i].manualOutflow + ' eom Content ' + typeof this.operationMonthlyData[i].eomContent);

        
        if (Number(this.operationMonthlyData[i].manualInflow) === 0 ) {
          myInflow = Number(this.operationMonthlyData[i].inflow);
          //console.log( i + ' inflow zero ' + this.operationMonthlyData[i].inflow);
        } else {
          myInflow = Number(this.operationMonthlyData[i].manualInflow);
          //console.log( i + ' not inflow zero ' + myInflow);
        }

        
        //console.log( i + ' myInflow ' + typeof myInflow + ' ' + myInflow);
        
        if (this.operationMonthlyData[i].manualOutflow === 0 ) {
          myOutflow = this.operationMonthlyData[i].outflow;
          //console.log( i + '  outflow zero ' + myOutflow);
        } else {
          myOutflow = Number(this.operationMonthlyData[i].manualOutflow);
          //console.log( i + ' outflow not zero ' + myOutflow);
        }

        //console.log( i + ' ' + typeof myOutflow + ' ' + myOutflow);



        //console.log( myEomContent + ' ' + myInflow + ' ' + myOutflow + ' ' +(myEomContent + myInflow - myOutflow ) );
        
        //console.log( i + ' ' + typeof myOutflow+ ' ' + myOutflow + ' ' + (myEomContent + myInflow - myOutflow) );

        //console.log('eomContent ' + myEomContent + ' infow ' + myInflow + ' outflow ' + myOutflow);
        
        this.operationMonthlyData[i].eomContent = myEomContent + myInflow - myOutflow;

        //remove this.operationMonthlyData[i].eomElevation = this.getElevation(this.operationMonthlyData[i].eomContent);
        this.operationMonthlyData[i].eomElevation = this.elevationService.getElevation(this.operationMonthlyData[i].eomContent);

        this.operationMonthlyData[i].elevationWarning = this.getElevationWarning(this.operationMonthlyData[i].eomElevation);

       // console.log('[' + this.operationMonthlyData[i].elevationWarning + ']');

      }
      console.log(this.operationMonthlyData);

      this.addToGridElevation();

    }

    getEOMContentList(data:any):number[] {
      console.log('-------- OperationsDataComponent.getEOMContentList --------');

      let eomContent = new Array();
      
      let myEomContent = 0;

      eomContent =[];

      for (let i = 0; i < data.length; i++) {
        
        myEomContent = (this.startingEOMContent + data[i].inflow - data[i].outflow); 
        eomContent.push(myEomContent);
      }
        
      console.log(eomContent);

      return eomContent;
    }

    setEOMContentList(data:any, baseContent:number) {
      console.log('-------- OperationsDataComponent.setEOMContentList --------');

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

    getOperationData() {
      console.log('-------- OperationsDataComponent.getOperationData --------');

      this.startingEOMContent = 0.0;
      let temp:any = this.operationsService.getJson();

      //const obj = JSON.parse(temp);

      //if (temp.length > 2) {
      if (temp) {
  
        //this.operationMonthlyData = obj.data;
        this.operationMonthlyData = temp.data;

        this.startingEOMContent = parseInt( temp.initialAcreFeet.replace(',','')); 
        //this.startingEOMContent = parseInt( obj.initialAcreFeet.replace(',','')); 
  
        //this.eomContentLabel = "EOM Content " +  this.startingEOMContent + " elevation " + this.getElevation( this.startingEOMContent).toFixed(2);
        this.eomContentLabel = "EOM Content " +  this.startingEOMContent + " elevation " + this.elevationService.getElevation(this.startingEOMContent).toFixed(2);

        this.setEOMContentList(this.operationMonthlyData, this.startingEOMContent);

        this.getElevationGridData();

      }
  
    }

}
