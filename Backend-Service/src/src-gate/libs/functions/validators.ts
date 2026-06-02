import * as Validator from 'validatorjs';
import { getInvalidReqErrObj } from "./response";

export function validateBody(body, rules: object): boolean {

    let validation = new Validator(body, rules, {
        alpha_dash: 'White space is not allowed in :attribute',
        accepted: "The field ':attribute' value must be as true"
    });
    if (validation.passes()) {
        return true;
    } else {
        //***********NOTE****** */
        //validation.errors.all(); returns obj and its keys are as the fields on which error found and value of these keys
        // as err msg that we need to find out that is why using below for-in loop to run a loop on abj
        // and concatinating all error messages into one variable (finalErrMsg)
        const errMsgObj = validation.errors.all();
        let finalErrMsg = "";
        for (const property in errMsgObj) {
            finalErrMsg = finalErrMsg + ", " + errMsgObj[property][0];
        }
        throw getInvalidReqErrObj(finalErrMsg);
    }
}


export function validateParams(params, rules): boolean {
    let validation = new Validator(params, rules);
    if (validation.passes()) {
        return true;
    } else {
        //***********NOTE****** */
        //validation.errors.all(); returns obj and its keys are as the fields on which error found and value of these keys
        // as err msg that we need to find out that is why using below for-in loop to run a loop on abj
        // and concatinating all error messages into one variable (finalErrMsg)
        const errMsgObj = validation.errors.all();
        let finalErrMsg = "";
        for (const property in errMsgObj) {
            finalErrMsg = finalErrMsg + ", " + errMsgObj[property][0];
        }
        throw getInvalidReqErrObj(finalErrMsg);
    }
}

export function validateQueryString(query, rules): boolean {
    let validation = new Validator(query, rules);
    if (validation.passes()) {
        return true;
    } else {
        //***********NOTE****** */
        //validation.errors.all(); returns obj and its keys are as the fields on which error found and value of these keys
        // as err msg that we need to find out that is why using below for-in loop to run a loop on abj
        // and concatinating all error messages into one variable (finalErrMsg)
        const errMsgObj = validation.errors.all();
        let finalErrMsg = "";
        for (const property in errMsgObj) {
            finalErrMsg = finalErrMsg + ", " + errMsgObj[property][0];
        }
        throw getInvalidReqErrObj(finalErrMsg);
    }
}


export function getRegex(value: string): RegExp {
    return new RegExp(value.trim());
}

export function getSkip(pageNumber: number, limit: number): number {
    return ((pageNumber - 1) * limit);
}

/*
only pass string generated after JSON.stringify
*/
export function getParsedObj(stringifiedString: string) {
    return JSON.parse(stringifiedString);
}