import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  providers: [MessageService]
})
export class AnalyticsComponent {
  reports:any = [];

  reader = new FileReader;
  fileLines:any = [];

  totalSize : number = 0;

  totalSizePercent : number = 0;

  myCallback:any = null;

  fileDialogVisible = false;
  clearfileDialogVisible = false;
  analyticSidebarVisible = false;
  fileImportSidebarVisible = false;

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
    this.totalSize = 0
    this.totalSizePercent = 0;
    this.closeClearReportDataDialog();
    this.messageService.add({ severity: 'success', summary: 'Reports Removed', detail: 'The loaded reports have been removed', life: 3000 });

  }

  masterCheckChanged() {
    console.log('--- AnalyticsComponent.masterCheckChanged --- ' + this.masterChecked);
    

    //This has to be put in another method
    for (let i = 0; i < this.reports.length; i++) {
      console.log('--- Changing checkbox ---');
      this.reports[i].checked =   this.masterChecked;
    }

  }

  choose(event:any, callback:any) {
    console.log('--- AnalyticsComponent.choose ---');
    console.log(callback);
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

    console.log(event.files);

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
        console.log('onSelectedFiles foreach filesize ' + parseInt(this.formatSize(file.size)));
          this.totalSize += parseInt(this.formatSize(file.size));
      });


      this.totalSizePercent = this.totalSize / 10;
      console.log("this.totalSizePercent " + this.totalSizePercent);
  }

  readOperationalData(myFile:any) {
    console.log('--- AnalyticsComponent.readOperationalData ---');
    console.log(myFile);

    let myReadJson:any = {};

    let reader = new FileReader;
    let fileLines:any = "";
    console.log('calling reader ');
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
       console.log(this.reports.length);
      }
    };
  }

  uploadEvent(callback:any) {
    console.log('--- AnalyticsComponent.uploadEvent ---');
    console.log(callback);
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

}
