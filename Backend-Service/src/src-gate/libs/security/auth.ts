import * as jwt from "jsonwebtoken";
import { Request } from 'express';
import { encryption, decryption } from "./e.decryption";
import { IJwt } from "src/src-gate/libs/interfaces";
import { UserRoles, errMessages } from "src/src-gate/libs/constants/enums";
import { getUAErrObj } from "src/src-gate/libs/functions/response";
import { JWT_CONFIG } from "./constants";

export function getJwtToken(data: IJwt, expiresIn: string = JWT_CONFIG.expiresIn): Promise<string> {

    const encryptedData = encryption(JSON.stringify(data));
    return new Promise((resolve, reject) => {
        jwt.sign({
            STRING: encryptedData
        }, JWT_CONFIG.secret, { expiresIn }, (err, token) => {

            if (err) reject(err);
            else resolve(token);
        });
    });
}

export function verifyJwtToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_CONFIG.secret, (err, decoded) => {
            if (decoded && !err) {
                //decrypting data because decoeded data is in encrypted form
                resolve(decryption(decoded.STRING));
            }
            else { reject(err) };
        });
    });
}

export function validateApiAccessRole(req: Request, apiOwner1: string, apiOwner2: string = null, apiOwner3: string = null): boolean {
    // console.log("##############Gate2 api owner checking##################", apiOwner1, "==", req['CURRENT_USER']['ROLE'])

    if ((req['CURRENT_USER'] && req['CURRENT_USER']['ROLE'] === apiOwner1) || (req['CURRENT_USER']['ROLE'] === apiOwner2) || (req['CURRENT_USER']['ROLE'] === apiOwner3)) {
        return true;
    } else {

        throw getUAErrObj(errMessages.INVALID_ROLE);
    }
}


