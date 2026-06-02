import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum, IsArray } from 'class-validator';

export class createAssignLeaderDto {
    @IsString()
    @IsNotEmpty()
    teamLeadId: string;

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    employeeIds: string[];
}
