import { HttpException } from '@nestjs/common';
import { httpCodes, httpCodesMessages } from "../constants/http.codes";
import { IOkResponse, ICreatedResponse, IUpdatedResponse } from "../interfaces";
import { ErrTypes } from "../constants/enums";

let message: string = httpCodesMessages.INTERNAL_SERVER_ERROR;

export function commonErrRes(error: any): any {
   
    let statusCode: number = httpCodes.INTERNAL_SERVER_ERROR;

    if (error && error.type === ErrTypes.CUSTOM) {
        message = error.message + " " + "";
        statusCode = error.statusCode;
        error = error.err
    } else {// means error thorw by system/server so set it 500/internal server error
        message = httpCodesMessages.INTERNAL_SERVER_ERROR + " " + "SF";
        statusCode = httpCodes.INTERNAL_SERVER_ERROR;
        error = httpCodesMessages.INTERNAL_SERVER_ERROR;
    }

    return new HttpException({ statusCode, error, message }, statusCode);
}

export function unAuthorizedRes(error: any): any {
    let statusCode: number = httpCodes.UNAUTHORIZED;
    message = error;
    error = httpCodesMessages.UNAUTHORIZED;

    return new HttpException({ statusCode, error, message }, statusCode);
}

export function getOkResObj(data: Array<any> | object, count: number): IOkResponse {

    count = count ? count : 0;
    return { statusCode: httpCodes.OK, data, count, message: httpCodesMessages.OK };
}

export function getCreatedResObj(data: Array<any> | object, count: number = 1): ICreatedResponse {

    return { statusCode: httpCodes.CREATED, data, count, message: httpCodesMessages.CREATED };
}

export function getUpdatedResObj(): IUpdatedResponse {

    return { statusCode: httpCodes.NO_CONTENT, message: httpCodesMessages.NO_CONTENT };
}

export function getISErrObj(err: string): any {
    return {
        type: ErrTypes.CUSTOM,
        err: httpCodesMessages.INTERNAL_SERVER_ERROR,
        statusCode: httpCodes.INTERNAL_SERVER_ERROR,
        message: err
    };
}

export function getUAErrObj(err: string): any { // UA = un-authorized
    return {
        type: ErrTypes.CUSTOM,
        err: httpCodesMessages.UNAUTHORIZED,
        statusCode: httpCodes.UNAUTHORIZED,
        message: err
    };
}

export function getInvalidReqErrObj(err: string): any {
    return {
        type: ErrTypes.CUSTOM,
        err: httpCodesMessages.INVALID_REQ,
        statusCode: httpCodes.INVALID_REQ,
        message: err
    };
}