import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

//custom
import { UserService } from '../../services/user.service';
import { routesList, regexList } from "src/app/libs/constants";
import { UserRoles } from "src/app/libs/constants/enums";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public roleList = [
    { label: UserRoles.EMPLOYEE, value: UserRoles.EMPLOYEE },
    { label: UserRoles.TEAM_LEADER, value: UserRoles.TEAM_LEADER },
    // { label: UserRoles.MANAGER, value: UserRoles.MANAGER }
  ];
  public showErr: boolean = false;
  public loader: boolean = false;
  public routesList: any = routesList;
  public regexList: any = regexList;
  public signUpSubs: any = "";
  public signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService) {

    this.signUpForm = this.formBuilder.group({
      fName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      lName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
      phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      role: [UserRoles.EMPLOYEE, [Validators.required]]
    });
  }


  signUp(): void {

    this.showErr = true;
    if (this.signUpForm.invalid) {

      this.showToastr(false, "Please fill all required fields!");
      return;
    }

    let payload = Object.assign({}, this.signUpForm.value);
    this.loader = true;
    this.signUpSubs = this.userService.signUp(payload).subscribe(res => {

      this.showErr = false;
      this.showToastr(true, "User signed up successfully!", true);
      this.loader = false;
      this.router.navigate([routesList.LOGIN.path]);
    }, err => {

      this.loader = false;
      this.showToastr(false, err, true);
    });
  }

  showToastr(success: boolean, info: any, sticky: boolean = false): void {

    this.messageService.clear()
    if (success) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: info, sticky });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: info.message || info, sticky });
    }
  }

  ngOnDestroy() {

    if (this.signUpSubs) {

      this.signUpSubs.unsubscribe();
    }
  }
}

