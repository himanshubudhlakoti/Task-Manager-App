import { Controller, Body, Post, Param, Patch, HttpCode, Req, Get, Query } from '@nestjs/common';
import { Request } from 'express';
import { commonErrRes } from "src/src-gate/libs/functions/response";
import { ICreatedResponse, IUpdatedResponse, IOkResponse } from "src/src-gate/libs/interfaces";
import setLog from "src/src-gate/libs/functions/logger";
import { httpCodes } from "src/src-gate/libs/constants/http.codes";
import { UserRoles } from "src/src-gate/libs/constants/enums";
import { TasksService } from "../services/tasks.service";
import { Roles } from 'src/src-gate/libs/security/RBAC/roles.decorator';
import { RolesGuard } from 'src/src-gate/libs/security/RBAC/RBAC.guard';
import { UseGuards } from '@nestjs/common';
import { assignATaskToEmployeeDto, createTaskByEmployeeDto, updateTaskDto } from '../dto';
const controllerName: string = "tasks-controller";

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }

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
            setLog(err, `${controllerName}/updateTask`);
            throw commonErrRes(err);
        }
    }

    @Patch('delete-task/:taskId')
    @HttpCode(httpCodes.NO_CONTENT)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.EMPLOYEE, UserRoles.TEAM_LEADER, UserRoles.MANAGER)
    async deleteTask(@Param('taskId') taskId: string): Promise<IUpdatedResponse> {
        try {

            return await this.tasksService.deleteTask(taskId);
        } catch (err) {
            setLog(err, `${controllerName}/deleteTask`);
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
    async getTeamLeadTasksById(@Param('teamLeadId') teamLeadId: string): Promise<IOkResponse> {
        try {

            return await this.tasksService.getTeamLeadTasksById(teamLeadId);
        } catch (err) {
            setLog(err, `${controllerName}/getTeamLeadTasksById`);
            throw commonErrRes(err);
        }
    }
}