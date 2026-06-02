import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/src-gate/libs/database-schemas/user.schema';
import { Task, TaskSchema } from 'src/src-gate/libs/database-schemas/task.schema';
import { DatabaseService } from "./services/database.service";

@Module({
    imports: [MongooseModule.forFeature([

        { name: User.name, schema: UserSchema },
        { name: Task.name, schema: TaskSchema }
    ])],
    controllers: [],
    providers: [DatabaseService],
    exports: [MongooseModule, DatabaseService]
})
export class DatabaseModule { }
