import { Controller, Body, Param, Patch, HttpCode, Req, Get, Query } from '@nestjs/common';
import { commonErrRes } from "src/src-gate/libs/functions/response";
import { IUpdatedResponse, IOkResponse } from "src/src-gate/libs/interfaces";
import { Request } from 'express';
import setLog from "src/src-gate/libs/functions/logger";
import { httpCodes } from "src/src-gate/libs/constants/http.codes";
import { UserRoles } from "src/src-gate/libs/constants/enums";
import { UsersService } from "../services/users.service";
import { Roles } from 'src/src-gate/libs/security/RBAC/roles.decorator';
import { RolesGuard } from 'src/src-gate/libs/security/RBAC/RBAC.guard';
import { UseGuards } from '@nestjs/common';
import { createAssignLeaderDto } from '../dto';

const controllerName: string = "users-controller";

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Get('get-users-list/:role')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.MANAGER)
    async getUsersList(@Param('role') role: UserRoles, @Query() query: { filters: string }): Promise<IOkResponse> {
        try {

            return await this.userService.getUsersList(role, query);
        } catch (err) {
            setLog(err, `${controllerName}/getUsersList`);
            throw commonErrRes(err);
        }
    }

    @Get('get-team-lead-employees')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.TEAM_LEADER)
    async getTeamLeadEmployees(@Req() req: Request): Promise<IOkResponse> {
        try {

            return await this.userService.getTeamLeadEmployees(req);
        } catch (err) {
            setLog(err, `${controllerName}/getTeamLeadEmployees`);
            throw commonErrRes(err);
        }
    }

    @Get('get-team-leads')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.MANAGER)
    async getTeamLeads(): Promise<IOkResponse> {
        try {

            return await this.userService.getTeamLeads();
        } catch (err) {
            setLog(err, `${controllerName}/getTeamLeads`);
            throw commonErrRes(err);
        }
    }

    @Patch('assign-leader')
    @HttpCode(httpCodes.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.MANAGER)
    async assignLeader(@Body() body: createAssignLeaderDto): Promise<IUpdatedResponse> {
        try {

            return await this.userService.assignLeader(body);
        } catch (err) {
            setLog(err, `${controllerName}/assignLeader`);
            throw commonErrRes(err);
        }
    }
}
