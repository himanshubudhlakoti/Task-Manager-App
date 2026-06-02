import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';

import { UserService } from '../../services/user.service';
import { setItemToLocal, clearLocalStorage } from "src/app/libs/functions";
import { routesList, regexList } from "src/app/libs/constants";
import { UserRoles } from "src/app/libs/constants/enums";
import { DataSharingService } from 'src/app/modules/shared-modules/data-sharing/services/data-sharing.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  public roleList = [
    { label: UserRoles.EMPLOYEE, value: UserRoles.EMPLOYEE },
    { label: UserRoles.TEAM_LEADER, value: UserRoles.TEAM_LEADER },
    { label: UserRoles.MANAGER, value: UserRoles.MANAGER }
  ];

  public userLoginSubs: any = "";
  public showErr: boolean = false;
  public routesList: any = routesList;
  public loader: boolean = false;
  public regexList: any = regexList;
  public loginForm: FormGroup;

  constructor(

    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private dataSharingService: DataSharingService) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: [UserRoles.EMPLOYEE, [Validators.required]]
    });

  }

  userLogin(): void | boolean {

    this.showErr = true;
    if (this.loginForm.invalid) {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields!', sticky: false });
      return false;
    }
    const payload: { email: string; password: string } = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    console.log(this.loginForm.value);
    this.loader = true;
    const role: UserRoles = this.loginForm.value.role;
    this.userLoginSubs = this.userService.userLogin(payload, role).subscribe(res => {

      this.loader = false;

      const userRole: UserRoles = res['data']['ROLE'];
      const token: string = res['data']['token'];
      this.dataSharingService.setCurrentUserRoleToShare(userRole);
      setItemToLocal('token', token);
      setItemToLocal('role', userRole);

      if (userRole === UserRoles.MANAGER) {

        this.router.navigate([this.routesList.TEAM_LEADS.path]);
      } else if (userRole === UserRoles.EMPLOYEE) {

        this.router.navigate([this.routesList.EMPLOYEES_TASKS.path]);
      }
      else if (userRole === UserRoles.TEAM_LEADER) {

        this.router.navigate([this.routesList.TEAM_LEADS_TASKS.path]);
      } else {
        return;
      }

    }, err => {

      clearLocalStorage();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, sticky: false });
      this.loader = false;
    });
  }

  ngOnDestroy() {

    if (this.userLoginSubs) {

      this.userLoginSubs.unsubscribe();
    }
  }
}
