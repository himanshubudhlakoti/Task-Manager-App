import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { DatabaseModule } from "src/src-gate/modules/database/database.module";
import { VerifyTokenMiddleware } from 'src/src-gate/libs/security/middleware';
const apiPrefix = "";

@Module({
    imports: [DatabaseModule],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(VerifyTokenMiddleware)
            .exclude()
            .forRoutes(TasksController);
    }
}