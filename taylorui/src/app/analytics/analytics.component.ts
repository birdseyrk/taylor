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

  masterChecked:boolean = false;

  constructor(private config: PrimeNGConfig, private messageService: MessageService) {}

  showFileDialog() {
    console.log('--- showFileDialog ---');

    this.fileDialogVisible = !this.fileDialogVisible;

  }

  masterCheckChanged() {
    console.log('--- showFileDialog --- ' + this.masterChecked);
    

    //This has to be put in another method
    for (let i = 0; i < this.reports.length; i++) {
      console.log('--- Changing checkbox ---');
      this.reports[i].checked =   this.masterChecked;
    }

  }

  choose(event:any, callback:any) {
    console.log('choose');
    console.log(callback);
    this.myCallback= callback ;

      callback();
  }

  onRemoveTemplatingFile(event:any, file:any, removeFileCallback:any, index:any) {
    console.log('onRemoveTemplatingFile index ' + index);
      removeFileCallback(event, index);
      this.totalSize -= parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear:any) {
    console.log('onClearTemplatingUpload ');
      clear();
      this.totalSize = 0;
      this.totalSizePercent = 0;
  }

  onTemplatedUpload(event:any) {
    console.log('onTemplatedUpload ');

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
    console.log('onSelectedFiles');
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
    console.log('readOperationalData ');
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
    console.log('uploadEvent');
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

  
  xreadOperationalData(event: FileUploadEvent) {
    console.log('readOperationalData');
    console.log(event);
    let myReadJson:any = {};

    let reader = new FileReader;
    let fileLines:any = "";

    reader.readAsText(event.files[0]);

    reader.onload = () => {
      console.log('reader.onload');

      fileLines = reader.result;
      
      if (fileLines.length > 0 ) {
        myReadJson = JSON.parse(fileLines);
        console.log(myReadJson);
      }
    };
  }

}
