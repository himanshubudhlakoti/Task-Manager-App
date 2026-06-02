
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { UserRoles } from 'src/src-gate/libs/constants/enums';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fName: string;

    @IsString()
    @IsNotEmpty()
    lName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(15)
    password: string;

    @IsString()
    @IsOptional()
    phoneNo?: string;

    @IsEnum(UserRoles)
    role: UserRoles;
}

export class UserLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
