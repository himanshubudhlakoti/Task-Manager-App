export enum httpCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    INVALID_REQ = 400,
    UNAUTHORIZED = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum httpCodesMessages {
    OK = 'Record fetched successfully!',
    CREATED = "Record created successfully!",
    NO_CONTENT = "Record updated successfully!",
    INVALID_REQ = "Invalid request!",
    UNAUTHORIZED = "Un-authorized access!",
    NOT_FOUND = "Record not found!",
    INTERNAL_SERVER_ERROR = "Internal server error!",
}