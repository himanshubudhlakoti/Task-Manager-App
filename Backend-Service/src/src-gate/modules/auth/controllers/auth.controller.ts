import { Controller, Body, Res, Post, HttpCode, Param, Req, Get, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { commonErrRes } from "src/src-gate/libs/functions/response";
import { IOkResponse, ICreatedResponse } from "src/src-gate/libs/interfaces";
import { AuthService } from '../services/auth.service';
import { CreateUserDto, UserLoginDto } from "../dto";
import setLog from "src/src-gate/libs/functions/logger";
import { httpCodes } from "src/src-gate/libs/constants/http.codes";
import { UserRoles } from "src/src-gate/libs/constants/enums";
import { Roles } from 'src/src-gate/libs/security/RBAC/roles.decorator';
import { RolesGuard } from 'src/src-gate/libs/security/RBAC/RBAC.guard';
const controllerName: string = "auth-controller";

@Controller('auths')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('add-user')
    @HttpCode(httpCodes.CREATED)
    async addUser(@Body() body: CreateUserDto): Promise<ICreatedResponse> {
        try {

            return await this.authService.addUser(body);
        } catch (err) {
            setLog(err, `${controllerName}/addUser`);
            throw commonErrRes(err);
        }
    }


    @Post('user-login/:role')
    @HttpCode(httpCodes.OK)
    async userLogin(
        @Res({ passthrough: true }) res: Response,
        @Body() rBody: UserLoginDto,
        @Param('role') role: string,
    ): Promise<IOkResponse> {
        try {

            return await this.authService.userLogin(res, role as UserRoles, rBody);
        } catch (err) {
            setLog(err, `${controllerName}/userLogin`);
            throw commonErrRes(err);
        }
    }

    @Get('get-user-profile')
    @HttpCode(httpCodes.OK)
    @UseGuards(RolesGuard)
    @Roles(UserRoles.EMPLOYEE, UserRoles.TEAM_LEADER, UserRoles.MANAGER)
    async getUserProfile(@Req() req: Request): Promise<IOkResponse> {
        try {
            return await this.authService.getUserProfile(req);
        } catch (err) {
            setLog(err, `${controllerName}/getUserProfile`);
            throw commonErrRes(err);
        }
    }

    @Post('verify-refresh-token')
    @HttpCode(httpCodes.OK)
    async verifyRefreshToken(@Req() req: Request): Promise<IOkResponse> {
        try {
            return await this.authService.verifyRefreshToken(req);
        } catch (err) {
            setLog(err, `${controllerName}/verifyRefreshToken`);
            throw commonErrRes(err);
        }
    }
}
