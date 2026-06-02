
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { TaskStatuses, UserRoles } from 'src/src-gate/libs/constants/enums';

export class createTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    assignedToId: string;

    @IsEnum(TaskStatuses)
    @IsNotEmpty()
    status: string;
}

export class createTaskByEmployeeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatuses)
    @IsNotEmpty()
    status: string;
}

export class assignATaskToEmployeeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatuses)
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    assignedToId: string;
}

export class updateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatuses)
    @IsNotEmpty()
    status: string;
}