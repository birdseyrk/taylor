import { Component } from '@angular/core';
//import {MenuItem, MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  //providers: [MessageService]
})
export class AppComponent {
  title = 'taylorui';
 // items: MenuItem[] | undefined;

  // todo do not need this constructor(private messageService: MessageService) {}
  

  // showMessage(mySeverity:string, mySummary:string, myMessage:string, myLife:any) {
  //   //severity: info success warn error
  //     this.messageService.add({key: 'menu', severity:mySeverity, summary: mySummary, detail: myMessage, life:myLife});
  // }

//   ngOnInit() {
    
//     this.items = [
//       {
//         label: 'File',
//         icon: 'pi pi-file',
//         items: [
//           {
//             label: 'New',
//             icon: 'pi pi-plus',
//             command: () => {
//               console.log('New');
//               this.showMessage('success', 'Success', 'File created', 3000);
//             },
//           },
//           {
//             label: 'Print',
//             icon: 'pi pi-print',
//             command: () => {
//               console.log('Print');
//               this.showMessage('error', 'Error', 'No printer connected', 3000);
//             },
//           },
//         ],
//       },
//       {
//         label: 'Search',
//         icon: 'pi pi-search',
//         command: () => {
//           console.log('Search');
//           this.showMessage('warn', 'Search Results', 'No results found', 3000);
//         },
//       },
//       {
//         separator: true,
//       },
//       {
//         label: 'Sync',
//         icon: 'pi pi-cloud',
//         items: [
//           {
//             label: 'Import',
//             icon: 'pi pi-cloud-download',
//             command: () => {
//               console.log('Import');
//               this.showMessage('info', 'Downloads', 'Downloaded from cloud', 3000);
//             },
//           },
//           {
//             label: 'Export',
//             icon: 'pi pi-cloud-upload',
//             command: () => {
//               console.log('Export');
              
//               this.showMessage('info', 'Shared', 'Exported to cloud', 3000);
//             },
//           },
//         ],
//       },
//     ];
// }
}
