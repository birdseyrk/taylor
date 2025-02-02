
export class Daily {  // extends Array

    public day:string                 = '';
    public avgInflowCFS:number        = 0;
    public inflowChangeColor:string   = '';
    public index:number               = 0;
    public inflow:number              = 0;  //inflow per day
    public avgOutflowCFS:number       = 0;
    public originalInflow:number      = 0;
    public manualInflow:number        = 0;
    public manualInflowCFS:number     = 0;
    public outflow:number             = 0;
    public manualOutflowCFS:number    = 0;
    public manualOutflow:number       = 0;
    public lastOutflowCFS             = 0;
    public lastRolledUpCFS            = 0;
    public outflowChangeColor:string  = '';
    public dailyChangePerDayAF        = 0;
    public eomContent:number          = 0;
    public orgEomContent:number       = 0;
    public startingEomContent:number  = 0;
    public eomElevation:number        = 0;
    public elevationWarning:string    = '';
    public monthIndex:number          = 0;
    public monthChanged:boolean       = false;
  
    // constructor() {
    //   super();
    // }
  }

export class Monthly { // extends Array

    public avgInflowCFS:number            = 0;
    public avgOutflowCFS:number           = 0;
    public dateRange:string               = '';
    public days:number                    = 0;
    public elevationWarning:string        = '';
    public eomContent:number              = 0;
    public eomElevation:number            = 0;
    public index:number                   = 0;
    public inflow:number                  = 0;
    public inflowCF:number                = 0;
    public inflowSummaryColor:string      = '';
    public month:string                   = '';
    public monthIndex:number              = 0;
    public originalInflow:number          = 0;
    public originalOutflow:number         = 0;
    public originalEomContent             = 0;
    public outflow:number                 = 0;
    public outflowCF:number               = 0;
    public manualInflow:number            = 0;
    public manualInflowColor:string       = '';
    public manualInflowTextColor:string   = '';
    public manualOutflow:number           = 0;
    public manualOutflowColor:string      = '';
    public manualOutflowTextColor:string  = '';
    public startingEOMContent:number      = 0;
    public rolledUp:boolean               = false;
    public changed:boolean                = false;
  
    // constructor() {
    //   super();
    // }
  
   
    // logServerModule() {
    //   console.log('--------- Server Module Log Server ---------');
    //   console.log(
    //     'hostname ' +
    //       this.hostname +
    //       ' type ' +
    //       this.type +
    //       ' icon ' +
    //       this.icon +
    //       ' epoch ' +
    //       this.epoch +
    //       ' lastUpdate ' +
    //       this.lastUpdate +
    //       ' uptime ' +
    //       this.uptime +
    //       ' status ' +
    //       this.status
    //   );
    // }
  }

  export class Report {

    public title:string               = '';
    public name:string                = "";
    public forecast:string            = "";
    public reportDate:string          = ""; 
    public label1:string              = '';
    public label2:string              = '';
    public label3:string              = '';
    public startingEOMContent:number  = 0;
    public inflowSummary:string       = '';
    public normal:string              = '';
    public maxContent:string          = '';

    public yearTypeInflow:number      = 0;
    public eomContentLabel:string     = '';
    public yearTypeLabel:string       = '';
    public yearTypeBackground:string  = '';
    public reportName:string          = '';
    public reportHeader:string        = '';
    public reportId:string            = '';
    public reportYear:string          = '';
    public reportMonth:string         = '';
    public reportDay:string           = '';
    public forecastDate:string        = '';
    public forecastPercent:string     = '';
    public forecastAcreFeet:string    = '';
    public reportNameTitle:string     = '';
    public reportDateTitle:string     = '';
    public monthly:Monthly[]          = new Array();  //moved to myMonthlyReport
    public daily:any[]                = [];  //TODO - change any to Daily.  Not sure why it does not work in operations.service
  
    constructor() {
    }
}