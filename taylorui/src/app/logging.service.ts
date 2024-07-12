import { UpperCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  

  log = (level:string, info:string) => {
    //console.info('-- ' + level +' TODO Date ' + info + ' ---');
    //TODO put in switch
    // console.warn();
    // console.error();
    // console.debug();
    //data - mine
  }

// TODO add enums
//   loggingLevels:any = new Enum;
//    {
//     INFO,
//     WARNING,
//     ERROR,
//     DEBUG,
//     DATA
//   }

//   info(level:string, info:string) 
  
//   {switch(level.toUpperCase) { 
//     case 'INFO': { 
//        //statements; 
//        break; 
//     } 
//     case constant_expr2: { 
//        //statements; 
//        break; 
//     } 
//     default: { 
//        //statements; 
//        break; 
//     } 
//  } 

    
//     console.info('-- Log  TODO Date ' + level + ' ' + info + ' ---');
//   }

//   error(level:string, info:string) {
//     console.error('-- Log  TODO Date ' + level + ' ' + info + ' ---');
//   }

//   warn(level:string, info:string) {
//     console.warn('-- Log  TODO Date ' + level + ' ' + info + ' ---');
//   }

//   log(level:string, info:string) {
//     console.log('-- Log  TODO Date ' + level + ' ' + info + ' ---');
//   }

//   data(level:string, data:any) {
//     console.log('--- Data TODO Date ' + level + ' below ---');
//     console.log(data);
//     console.log('--- Data TODO Date ' + level + ' above ---');
//   }

//   console.debug("debug"); // Likely hidden by default
// console.info("info");
// console.error("error");
// console.warn("warn");
// console.log("log");

}
