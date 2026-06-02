import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from "./auth";
import { unAuthorizedRes } from "src/src-gate/libs/functions/response";
import { UserRoles } from "src/src-gate/libs/constants/enums";


@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {

    constructor() { }
    async use(req: Request, res: Response, next: NextFunction) {

        if (req.headers.authorization && req.headers.role) {
            const jwtToken = req.headers.authorization.replace('Bearer ', "");
            const role = req.headers.role as UserRoles;
            try {

                //verify jwt token coming with req. and decode its data.
                const decodedUser = await verifyJwtToken(jwtToken);
                //check decoded data role and role coming with req. if it is different then reject it
                if (decodedUser.ROLE === role) {

                    req['CURRENT_USER'] = decodedUser;
                    next();
                } else {
                    throw unAuthorizedRes("Invalid Token or Role, Please try to login again!");
                }
            } catch (err) {

                throw unAuthorizedRes("Invalid Token or Role, Please try to login again!");
            }
        } else {
            throw unAuthorizedRes("Token or Role missing in headers!");
        }
    }
}
