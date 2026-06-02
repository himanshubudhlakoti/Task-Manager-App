import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { DatabaseModule } from "src/src-gate/modules/database/database.module";
import { VerifyTokenMiddleware } from 'src/src-gate/libs/security/middleware';
const apiPrefix = "";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude(
        // { path: `${apiPrefix}/admins/add-supers`, method: RequestMethod.POST }
      )
      .forRoutes(UsersController);
  }
}