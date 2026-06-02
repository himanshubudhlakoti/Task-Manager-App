
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from "./base.schema";
import { TaskStatuses } from "src/src-gate/libs/constants/enums";

export type TaskDocument = Task & Document;

@Schema({ timestamps: false, versionKey: false })
export class Task extends Base {

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, default: "" })
    description: string;

    @Prop({ type: Types.ObjectId, required: true })
    assignedById: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    assignedToId: Types.ObjectId;

    @Prop({ enum: TaskStatuses, default: TaskStatuses.PENDING })
    status: TaskStatuses;
}

export const TaskSchema = SchemaFactory.createForClass(Task);