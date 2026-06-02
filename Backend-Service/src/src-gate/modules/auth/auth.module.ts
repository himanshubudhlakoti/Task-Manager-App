import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { DatabaseModule } from "src/src-gate/modules/database/database.module"; // importing for database module
import { VerifyTokenMiddleware } from "src/src-gate/libs/security/middleware";
const apiPrefix = "";

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(VerifyTokenMiddleware)
            .exclude(
                { path: `${apiPrefix}/auths/add-user`, method: RequestMethod.POST },
                { path: `${apiPrefix}/auths/user-login/:userRole`, method: RequestMethod.POST },
                { path: `${apiPrefix}/auths/verify-refresh-token`, method: RequestMethod.POST },

            ).forRoutes(AuthController);
    }
}