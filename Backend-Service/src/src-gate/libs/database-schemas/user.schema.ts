import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from "./base.schema";
import { UserRoles } from "src/src-gate/libs/constants/enums";

export type UserDocument = User & Document;

@Schema({ timestamps: false, versionKey: false })
export class User extends Base {

    @Prop({ type: String, required: true })
    fName: string;

    @Prop({ type: String, required: true })
    lName: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, default: null })
    phoneNo: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, default: null })
    token: string;

    @Prop({ type: String, enum: UserRoles, required: true })
    role: UserRoles;

    //if role is manager/ teamlead then this field wil be empty otherwise it will have teamlead id to which 
    // the user is assigned
    @Prop({ type: Types.ObjectId, default: null })
    teamLeadId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);