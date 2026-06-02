import { TCustomObj } from "../types";

export interface IJwt {
    readonly USER_ID: string;
    readonly ROLE: string;
    readonly EMAIL: string;
}

export interface IOkResponse {
    data: object | Array<any>,
    message: string,
    count: number,
    statusCode: number
}

export interface ICreatedResponse {
    data: object | Array<any>,
    message: string,
    count: number,
    statusCode: number
}

export interface IUpdatedResponse {
    message: string,
    statusCode: number
}

export interface IGetSingleRecord {
    record: TCustomObj,
    count: number
}

export interface IGetAllRecordsWithAggregate {
    records: Array<any>,
    count: number
}

export interface IFindAllWithAggregate {
    records: Array<any>,
}


export interface IGetAllRecordsWithFilters {
    records: Array<any>,
    count: number
}


export interface ICreateSingleRecord {
    record: object,
    count: number
}

export interface IDataToCheckIfAlreadyExists {
    email: string,
    stripeConnectedAccId: string
}
