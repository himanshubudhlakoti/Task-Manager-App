import { Controller, Body, Post, Param, Patch, HttpCode, Req, Get, Query } from '@nestjs/common';
import { Request } from 'express';
import { commonErrRes } from "src/src-gate/libs/functions/response";
import { ICreatedResponse, IUpdatedResponse, IOkResponse } from "src/src-gate/libs/interfaces";

import setLog from "src/src-gate/libs/functions/logger";
import { validateApiAccessRole } from "src/src-gate/libs/security/auth";

import { httpCodes } from "src/src-gate/libs/constants/http.codes";
import { UserRoles } from "src/src-gate/libs/constants/enums";
import { TasksService } from "../services/tasks.service";
import { query } from 'express';
import { Roles } from 'src/src-gate/libs/security/RBAC/roles.decorator';
import { RolesGuard } from 'src/src-gate/libs/security/RBAC/RBAC.guard';
import { UseGuards } from '@nestjs/common';
import { assignATaskToEmployeeDto, createTaskByEmployeeDto, createTaskDto, updateTaskDto } from '../dto';

const controllerName: string = "tasks-controller";

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }

    @Get('get-employee-todos-list')
    @HttpCode(httpCodes.OK)
    async createTask(@Req() req, @Body() taskData: createTaskDto): Promise<ICreatedResponse> {
        try {

            return await this.tasksService.createTask(req, taskData);
        } catch (err) {
            setLog(err, `${controllerName}/createTask`);
            throw commonErrRes(err);
        }
    }

    @Get('get-users-list/:role')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.MANAGER)
    async getUsersList(@Req() req, @Param('role') role: UserRoles, @Query() query: { filters: string }): Promise<IOkResponse> {
        try {

            // validateApiAccessRole(req, UserRoles.SUPER_ADMIN);
            return await this.tasksService.getUsersList(role, query);
        } catch (err) {
            setLog(err, `${controllerName}/getUsersList`);
            throw commonErrRes(err);
        }
    }

    @Post('create-task-for-self')
    @HttpCode(httpCodes.CREATED)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.EMPLOYEE, UserRoles.TEAM_LEADER, UserRoles.MANAGER)
    async createTaskForSelf(@Req() req: any, @Body() taskData: createTaskByEmployeeDto): Promise<ICreatedResponse> {
        try {

            return await this.tasksService.createTaskForSelf(req, taskData);
        } catch (err) {
            setLog(err, `${controllerName}/createTaskForSelf`);
            throw commonErrRes(err);
        }
    }

    @Post('assign-task-to-employee-by-team-lead')
    @HttpCode(httpCodes.CREATED)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.TEAM_LEADER, UserRoles.MANAGER)
    async assignATaskToEmployeeByTeamLead(@Req() req: any, @Body() taskData: assignATaskToEmployeeDto): Promise<ICreatedResponse> {
        try {

            return await this.tasksService.assignATaskToEmployeeByTeamLead(req, taskData);
        } catch (err) {
            setLog(err, `${controllerName}/assignATaskToEmployeeByTeamLead`);
            throw commonErrRes(err);
        }
    }


    @Patch('update-task/:taskId')
    @HttpCode(httpCodes.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.EMPLOYEE, UserRoles.TEAM_LEADER, UserRoles.MANAGER)
    async updateTask(@Req() req: any, @Param('taskId') taskId: string, @Body() taskData: updateTaskDto): Promise<IUpdatedResponse> {
        try {

            return await this.tasksService.updateTask(taskId, taskData);
        } catch (err) {
            setLog(err, `${controllerName}/updateTaskByEmployee`);
            throw commonErrRes(err);
        }
    }


    @Get('get-employee-tasks')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.EMPLOYEE, UserRoles.TEAM_LEADER, UserRoles.MANAGER)
    async getEmployeeTasks(@Req() req: any): Promise<IOkResponse> {
        try {

            return await this.tasksService.getEmployeeTasks(req);
        } catch (err) {
            setLog(err, `${controllerName}/getEmployeeTasks`);
            throw commonErrRes(err);
        }
    }

    @Get('get-employee-tasks-by-id/:employeeId')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.TEAM_LEADER)
    async getEmployeeTasksById(@Req() req: Request, @Param('employeeId') employeeId: string): Promise<IOkResponse> {
        try {

            return await this.tasksService.getEmployeeTasksById(req, employeeId);
        } catch (err) {
            setLog(err, `${controllerName}/getEmployeeTasksById`);
            throw commonErrRes(err);
        }
    }

    @Get('get-team-lead-tasks-by-id/:teamLeadId')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.MANAGER)
    async getTeamLeadTasksById(@Req() req: Request, @Param('teamLeadId') teamLeadId: string): Promise<IOkResponse> {
        try {

            return await this.tasksService.getTeamLeadTasksById(req, teamLeadId);
        } catch (err) {
            setLog(err, `${controllerName}/getTeamLeadTasksById`);
            throw commonErrRes(err);
        }
    }
}