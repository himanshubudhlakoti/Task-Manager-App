import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose, Types, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserRoles } from "src/src-gate/libs/constants/enums";


//---------------
export type BaseDocument = Base & Document;

@Schema({ timestamps: false, _id: false, versionKey: false })
export class Base {

    @Prop({ type: Date, default: Date.now })
    addedAt: Date;

    @Prop({ type: Date, default: Date.now })
    modifiedAt: Date;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
    // addedBy: string;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
    // modifiedBy: string;

    // @Prop({
    //     default: UserRoles.SUPER_ADMIN,
    //     enum: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.ORG, UserRoles.VOLUNTEER],
    //     required: true
    // })
    // addedAuthor: UserRoles;

    // @Prop({
    //     default: UserRoles.SUPER_ADMIN,
    //     enum: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.ORG, UserRoles.VOLUNTEER],
    //     required: true
    // })
    // modifiedAuthor: UserRoles;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: false })
    isHardDeleted: boolean;

}
//--------------