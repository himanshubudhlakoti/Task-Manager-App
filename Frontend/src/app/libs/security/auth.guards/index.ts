import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { Injectable } from '@angular/core';
import { getItemFromLocal } from "../../functions";
import { routesList } from "../../constants";
import { UserRoles } from "../../constants/enums";

@Injectable()
export class EntryAuthGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(): any {
        if (getItemFromLocal("token")) {
            return true;
        }
        else {

            /*means we have token need to redirect to dashboard and if the token would be invalid
             then it would be handled by header's api, header api would remove the token from localstorage and
             redirect to login page again*/
            this.router.navigate([routesList.LOGIN.path]);
        }
    }
}

@Injectable()
export class LoginAuthGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(): any {
        if (getItemFromLocal("token")) {//if there is a token then we consider -- user inside the dashboard 

            // console.log("redirect from login auth+++++++++++++++++++++");
            this.router.navigate([routesList.DASHBOARD.path]);
        }
        else {
            return true;
        }
    }
}

@Injectable()
export class RBACAuthGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): any {

        const role: UserRoles | null | string = getItemFromLocal("role");
        const token: string | null | string = getItemFromLocal("token");
        if (!token) {

            this.makeExit();
            return false;
        }

        const allowedRoles: any[] = route.data.roles;

        if (allowedRoles.includes(role)) {
            return true;
        }
        this.makeExit();
        return false;
    }

    private makeExit(): void {

        alert("You don't have permission to access this page!");

        localStorage.clear();
        this.router.navigate([routesList.LOGIN.path]);
    }
}
