import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BaseDocument = Base & Document;

@Schema({ timestamps: false, _id: false, versionKey: false })
export class Base {

    @Prop({ type: Date, default: Date.now })
    addedAt: Date;

    @Prop({ type: Date, default: Date.now })
    modifiedAt: Date;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: false })
    isHardDeleted: boolean;

}