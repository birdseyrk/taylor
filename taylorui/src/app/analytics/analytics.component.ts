import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { SortEvent } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  providers: [MessageService]
})
export class AnalyticsComponent {
  reports:any = [];
  compareReports:any = [];

  isSorted: any = null;

  initialValue: any = [];

  reader = new FileReader;
  fileLines:any = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;

  compareFileCount: number = 0;

  myCallback:any = null;

  fileDialogVisible = false;
  clearfileDialogVisible = false;
  analyticSidebarVisible = false;
  fileImportSidebarVisible = false;
  compareFilesVisible = false

  masterChecked:boolean = false;

  removeUploadedFileCallback = "removeUploadedFileCallback";

  constructor(private config: PrimeNGConfig, private messageService: MessageService) {}

  showFileDialog() {
    console.log('--- AnalyticsComponent.showFileDialog ---');

    this.fileDialogVisible = !this.fileDialogVisible;

  }
  
  showClearReportDataDialog() {
    console.log('--- AnalyticsComponent.showClearReportDataDialog ---');

    this.clearfileDialogVisible = !this.clearfileDialogVisible;

  }

  closeClearReportDataDialog() {
    console.log('--- AnalyticsComponent.clearfileDialogVisible ---');

    this.clearfileDialogVisible = false;
  }

  clearReportData() {
    console.log('--- AnalyticsComponent.clearReportData ---');

    this.reports =[];
    this.fileLines = [];
    this.compareFileCount = 0;
    this.totalSize = 0
    this.totalSizePercent = 0;
    this.masterChecked = false;
    this.closeClearReportDataDialog();
    this.messageService.add({ severity: 'success', summary: 'Reports Removed', detail: 'The loaded reports have been removed', life: 3000 });

  }

  choose(event:any, callback:any) {
    console.log('--- AnalyticsComponent.choose ---');
    //console.log(callback);
    this.myCallback= callback ;

      callback();
  }

  onRemoveTemplatingFile(event:any, file:any, removeFileCallback:any, index:any) {
    console.log('--- AnalyticsComponent.onRemoveTemplatingFile index ' + index + ' ---');
      removeFileCallback(event, index);
      this.totalSize -= parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear:any) {
    console.log('--- AnalyticsComponent.onClearTemplatingUpload ---');
      clear();
      this.totalSize = 0;
      this.totalSizePercent = 0;
  }

  onTemplatedUpload(event:any) {
    console.log('--- AnalyticsComponent.onTemplatedUpload ---');

    //console.log(event.files);

    this.reports = [];

    event.files.forEach((file:any) => {
      console.log('--- calling readOperationalData ---');
      this.readOperationalData(file);
      });

      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
      this.fileDialogVisible = !this.fileDialogVisible;
  }

  onSelectedFiles(event:any) {
    console.log('--- AnalyticsComponent.onSelectedFiles ---');
      // this.files = event.currentFiles;
      // console.log(this.files.length);
      event.currentFiles.forEach((file:any) => {
        //console.log('onSelectedFiles foreach filesize ' + parseInt(this.formatSize(file.size)));
        this.totalSize += parseInt(this.formatSize(file.size));
      });


      this.totalSizePercent = this.totalSize / 10;
      console.log("this.totalSizePercent " + this.totalSizePercent);
  }

  readOperationalData(myFile:any) {
    console.log('--- AnalyticsComponent.readOperationalData ---');
    //console.log(myFile);

    let myReadJson:any = {};

    let reader = new FileReader;
    let fileLines:any = "";
    //console.log('calling reader ');
    reader.readAsText(myFile);

    reader.onload = () => {
      console.log('reader.onload ');
      fileLines = reader.result;
      //console.log(fileLines);
     // fileLines.push(JSON.parse(fileLines));
     // console.log( fileLines);
      //console.log('reader.onload files length ' + fileLines.length);
      
      if (fileLines.length > 0 ) {
       myReadJson = JSON.parse(fileLines);
       myReadJson.checked = false;
       //this.reports.push(JSON.parse(fileLines));
       this.reports.push(myReadJson);

       this.reports.sort((a:any, b:any) => a.reportId.localeCompare(b.reportId));

       this.initialValue = [...this.reports];

       console.log(this.reports);
      }
    };
  }

  uploadEvent(callback:any) {
    console.log('--- AnalyticsComponent.uploadEvent ---');
    //console.log(callback);
      callback();
  }

  formatSize(bytes:any) {
    //console.log('formatSize');
      const k = 1024;
      const dm = 3;
      const sizes:any = this.config.translation.fileSizeTypes;
      if (bytes === 0) {
          return `0 ${sizes[0]}`;
      }

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

      return `${formattedSize} ${sizes[i]}`;
  }


  allReportsChecked (myReports:any):boolean {
    console.log('--- AnalyticsComponent.allReportsChecked --- ');
    for (let i = 0; i < myReports.length; i++) {
      if (!myReports[i].checked) {
        //console.log("--- returning false ");
        return false
      }
    }
    console.log("--- returning true ");
    return true;
  }


  masterCheckChanged() {
    console.log('--- AnalyticsComponent.masterCheckChanged --- ' + this.masterChecked);
    

    //This has to be put in another method
    for (let i = 0; i < this.reports.length; i++) {
      //console.log('--- Changing checkbox ---');
      this.reports[i].checked =   this.masterChecked;
    }

    if (this.masterChecked) {
      this.compareFileCount = this.reports.length;
    } else {
      this.compareFileCount = 0;
    }

    //console.log("Compare File Count is " + this.compareFileCount);

  }
  compareFiles (myData:any)  {
    console.log('--- AnalyticsComponent.compareFiles ---');

    //console.log(myData);

    if ( myData.checked ) { 
      this.compareFileCount =  this.compareFileCount + 1;
    } else if (this.compareFileCount > 0 )  {
      this.compareFileCount =  this.compareFileCount - 1;
    }

    console.log("Compare File Count is " + this.compareFileCount);

    this.masterChecked = this.allReportsChecked(this.reports);

  }

  flattenReports(report:any) {
    
    //does not work

    let flattenedReport:any = [];
    //console.log(report.reportYear + "-" + report.reportMonth + "-" +  report.reportDay);
    //console.log(report.data.length);
    flattenedReport["reportYear"] = report.reportYear;
    flattenedReport["reportMonth"] = report.reportYear;
    flattenedReport["reportDay"] = report.reportYear;
    //console.log(flattenedReport);
    for (let i = 0; i < report.data.length; i++) {
      //console.log(report.data[i].month + " " + report.data[i].dateRange + " " + report.data[i].inflow + " ac-ft ");
      
    flattenedReport["month"] =report.data[i].month;
    flattenedReport["dateRange"] =  report.data[i].dateRange;
    flattenedReport["inflow"] = report.data[i].inflow;
    }

  }

  compareFilesDialog() {
    console.log('--- AnalyticsComponent.compareFilesDialog ---');
    //console.log(this.reports);
     //This has to be put in another method
     this.compareReports = [];
     for (let i = 0; i < this.reports.length; i++) {
      if ( this.reports[i].checked ) {

        this.compareReports.push(this.reports[i]);
      }
     }
      //console.log("length " + this.compareReports.length);
      //console.log("length data  " + this.compareReports[0].data.length);
      //console.log(this.compareReports);

      this.compareFilesVisible = !this.compareFilesVisible;
  }

  customSort(event: SortEvent) {
      if (this.isSorted == null || this.isSorted === undefined) {
          this.isSorted = true;
          this.sortTableData(event);
      } else if (this.isSorted == true) {
          this.isSorted = false;
          this.sortTableData(event);
      } else if (this.isSorted == false) {
          this.isSorted = null;
          this.reports = [...this.initialValue];
      }
  }

  sortTableData(event:any) {
    //console.log(event);
      event.data.sort((data1:any, data2:any) => {
          let value1 = data1[event.field];
          let value2 = data2[event.field];
          //console.log("value1 " + typeof value1 + " " + "value2 " + typeof value2); 
          let result = null;
          if (value1 == null && value2 != null) result = -1;
          else if (value1 != null && value2 == null) result = 1;
          else if (value1 == null && value2 == null) result = 0;
          else {
            if (event.field == "yearTypeLabel") {
              result = value1.localeCompare(value2);
            } else if (event.field == "normal") {
              result = Number(value1.substring(0, (value1.length -1 ))) < Number(value2.substring(0, (value2.length -1 ))) ? -1 : Number(value1.substring(0, (value1.length -1 ))) > Number(value2.substring(0, (value2.length -1 ))) ? 1 : 0;
            } else {
              result = Number(value1) < Number(value2) ? -1 : Number(value1) > Number(value2) ? 1 : 0;
            }
          }

          return event.order * result;
      });
  }

}
