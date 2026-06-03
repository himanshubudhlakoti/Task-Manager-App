import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { IOkResponse } from "src/src-gate/libs/interfaces";
import { DatabaseService } from "../../database/services/database.service";
import { getOkResObj, getISErrObj, unAuthorizedRes } from './../../../libs/functions/response';
import { getJwtToken, verifyJwtToken } from "src/src-gate/libs/security/auth";
import { comparePassword } from "src/src-gate/libs/security/e.decryption";
import { UserRoles } from "src/src-gate/libs/constants/enums";
import { getSingleRecord } from 'src/src-gate/libs/functions/db.queries';
import { TCustomObj } from 'src/src-gate/libs/types';
import { ICreatedResponse } from "src/src-gate/libs/interfaces";
import { getCreatedResObj } from "src/src-gate/libs/functions/response";
import { getHashPassword } from "src/src-gate/libs/security/e.decryption";
import { checkIfAlreadyExists } from "src/src-gate/libs/functions/db.queries";
import { getTrimmedString } from "src/src-gate/libs/functions/helper";
import { CreateUserDto, UserLoginDto } from "../dto";
import { JWT_CONFIG } from "src/src-gate/libs/security/constants";
import { IJwt } from "src/src-gate/libs/interfaces";
import { durationToMilliseconds, getTrimmedLowerCaseString } from "src/src-gate/libs/functions/helper";
@Injectable()
export class AuthService {
    constructor(
        private databaseService: DatabaseService
    ) { }

    async userLogin(res: Response, role: UserRoles, loginData: UserLoginDto): Promise<IOkResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        let USER_ROLE: UserRoles = null;

        switch (role) {
            case UserRoles.MANAGER:
                USER_ROLE = UserRoles.MANAGER;
                break;

            case UserRoles.TEAM_LEADER:
                USER_ROLE = UserRoles.TEAM_LEADER;
                break;

            case UserRoles.EMPLOYEE:
                USER_ROLE = UserRoles.EMPLOYEE;
                break;

            default:
                throw getISErrObj("No user role found!");
        }

        const { email, password } = loginData,
            condition = { email: getTrimmedLowerCaseString(email), role: USER_ROLE, isDeleted: false },
            project = { _id: 1, password: 1, email: 1 };

        //Check email is valid or invalid
        let dbResult: TCustomObj = (await getSingleRecord(USER_MODEL, condition, project)).record;

        if (!dbResult) {
            throw getISErrObj("Invalid email id!");
        } else {
            //checking for password 
            if (await comparePassword(password, dbResult.password)) {

                let resData: TCustomObj = dbResult
                //if password valid then generate JWT and add it to resData object

                const jwtPayloadData: IJwt = {
                    USER_ID: dbResult._id,
                    ROLE: USER_ROLE,
                    EMAIL: dbResult.email
                }
                //generate access token
                const token = await getJwtToken(jwtPayloadData);
                resData['token'] = token;
                resData['ROLE'] = USER_ROLE;
                delete resData['password']

                //generate refresh token
                const refreshToken = await getJwtToken(jwtPayloadData, JWT_CONFIG.refreshTokenExpiresIn);

                //setting refresh token to cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: durationToMilliseconds(JWT_CONFIG.refreshTokenExpiresIn)
                });
                return getOkResObj(resData, 1);
            } else {

                throw getISErrObj("Invalid password!");
            }
        }
    }


    async addUser(userData: CreateUserDto): Promise<ICreatedResponse> {

        userData.password = await getHashPassword(userData.password);
        userData.email = getTrimmedLowerCaseString(userData.email);
        const { USER_MODEL } = this.databaseService.getDbModels();
        const preSaveCondition: { email: string, role: UserRoles } =
        {
            email: userData.email,
            role: userData.role
        };

        if (await checkIfAlreadyExists(USER_MODEL, preSaveCondition)) {

            throw getISErrObj(`The email id  '${preSaveCondition.email}' is already exists with another user!`);
        } else {
            const dbResult: TCustomObj = await USER_MODEL.create(userData);
            delete dbResult.password;
            return getCreatedResObj(dbResult, 1);
        }
    }

    async getUserProfile(req: Request): Promise<IOkResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        const condition: { _id: string } = { _id: req['CURRENT_USER']['USER_ID'] };
        const projection: TCustomObj = {
            _id: 1, fName: 1, lName: 1, email: 1, phoneNo: 1, role: 1
        };
        const dbResult = await getSingleRecord(USER_MODEL, condition, projection);
        return getOkResObj(dbResult.record, dbResult.count);
    }

    async verifyRefreshToken(req: Request): Promise<IOkResponse> {
        try {
            const refreshToken: string = req.cookies.refreshToken;
            if (!refreshToken) {
                throw unAuthorizedRes('Refresh token missing');
            }

            const decodedUser = await verifyJwtToken(refreshToken);
            const jwtPayload: IJwt = {
                USER_ID: decodedUser.USER_ID,
                ROLE: decodedUser.ROLE,
                EMAIL: decodedUser.EMAIL
            }
            const accessToken: string = await getJwtToken(jwtPayload);
            return getOkResObj({
                accessToken,
                role: decodedUser.ROLE
            }, 1);
        } catch (err) {
            throw unAuthorizedRes('Session Expired');
        }
    }
}
