
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from "./base.schema";
import { TaskStatuses } from "src/src-gate/libs/constants/enums";
import { User } from "./user.schema";

export type TaskDocument = Task & Document;

@Schema({ timestamps: false, versionKey: false })
export class Task extends Base {

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, default: "" })
    description: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    assignedById: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    assignedToId: Types.ObjectId;

    @Prop({ type: String, enum: TaskStatuses, default: TaskStatuses.PENDING })
    status: TaskStatuses;
}

export const TaskSchema = SchemaFactory.createForClass(Task);