import {
    CanActivate,
    ExecutionContext,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './roles.decorator';
import { getUAErrObj } from 'src/src-gate/libs/functions/response';
import { errMessages } from "src/src-gate/libs/constants/enums";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const currentUser = request.CURRENT_USER;

        if (
            currentUser &&
            requiredRoles.includes(currentUser.ROLE)
        ) {
            return true;
        }

        throw getUAErrObj(errMessages.INVALID_ROLE);
    }
}