import { Component } from '@angular/core';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  // formGroup: Form;
  myPassword: string = '';
  useremail: string = '';
  userValid: boolean = true;
  emailPattern = /^[0-9a-zA-Z-@._]+$/;
  emailTokens = /^[.@]+$/;
  periodFlag: boolean = false;
  atFlag: boolean = false;
  orderFlag: boolean = false;
  badFormatFlag: boolean = false;
  periodPosition: any = 0;
  atPosition: any = 0;

  checkEmailString = (myEmail:string): any => {
    console.log('INFO', '***** checkEmailString ******');
    console.log(this.useremail);

    this.periodPosition =this.useremail.substring((this.atPosition + 1 ), (this.useremail.length)).indexOf('.');
    this.atPosition = this.useremail.indexOf('@');

    if (this.useremail.substring((this.atPosition + 1 ), (this.useremail.length)).includes('.')) {
      this.periodFlag = true;
    } else {
      this.periodFlag = false;
    }

    if (this.useremail.includes('@')) {
      this.atFlag = true;
    } else {
      this.atFlag = false;
    }

    if ( ( this.atFlag ) && ( this.atPosition > 0 ) && (( this.useremail[(this.atPosition - 1)] === '.' ) || ( this.useremail[(this.atPosition + 1)] === '.' )) ) {
      this.badFormatFlag = true;
    } else {
      this.badFormatFlag = false;
    }

    if ( (!this.badFormatFlag) && (this.useremail.split("@").length > 2) ) {
      this.badFormatFlag = true;
    }

    if ( (!this.badFormatFlag) && (this.useremail.split("..").length > 1) ) {
      this.badFormatFlag = true;
    }

    // console.log('length     ' + this.useremail.length);
    // console.log('match      ' + this.useremail.match(this.emailPattern));
    // console.log('period     ' + this.periodFlag);
    // console.log('at         ' + this.atFlag);
    // console.log('bad        ' + this.badFormatFlag);
    // console.log('at Pos     ' + this.atPosition);
    // console.log('period Pos ' + this.periodPosition);
    // console.log('substring  ' + this.useremail.substring((this.atPosition + 1 ), (this.useremail.length)));
    // console.log('character  ' + this.useremail[(this.atPosition + 1)]);
    // console.log('@s         ' + this.useremail.split("@").length);
    // console.log('..         ' + this.useremail.split("..").length);

    if (
      this.useremail.length > 0 &&
      this.useremail.match(this.emailPattern) &&
      this.periodFlag &&
      this.atFlag && 
      !this.badFormatFlag
    ) {
      return true;
    } else {
      return false;
    }

  }

  handleKeyUpEvent = (event: any) => {
    console.log('INFO', '***** handleKeyUpEvent ******');
    this.userValid = this.checkEmailString(this.useremail);
  };
}
