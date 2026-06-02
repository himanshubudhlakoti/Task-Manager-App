import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/src-gate/libs/database-schemas/user.schema';
import { Task, TaskDocument } from 'src/src-gate/libs/database-schemas/task.schema';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name) private USER_MODEL: Model<UserDocument>,
        @InjectModel(Task.name) private TASK_MODEL: Model<TaskDocument>
    ) { }

    getDbModels() {
        return {
            USER_MODEL: this.USER_MODEL,
            TASK_MODEL: this.TASK_MODEL
        }
    }
}
