export class InputError {

    private row: number = 0;
    private error: string = "";
    private errorFatal:boolean = false;
    private myJson:any = {};

    public constructor(row: number, error: string,  errorFatal:boolean) {
        
        this.row = row;
        this.error = error;
        this.errorFatal = errorFatal;
    }

    public getRow():any {
        return this.row;
    }

    public getError():any {
        return this.error;
    }

    public getErrorFatal():any {
        return this.errorFatal;
    }

    public getJson():any {

        this.myJson["row"] = this.row;
        this.myJson["error"] = this.error;
        this.myJson["errorFatal"] = this.errorFatal;

        return this.myJson;

    }
    
}