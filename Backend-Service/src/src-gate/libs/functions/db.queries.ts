import { getISErrObj } from "./response";
import { IGetSingleRecord, ICreateSingleRecord, IGetAllRecordsWithFilters, IFindAllWithAggregate, IGetAllRecordsWithAggregate } from "src/src-gate/libs/interfaces";
import { getRegex, getSkip } from "src/src-gate/libs/functions/validators";
import { TCustomObj } from 'src/src-gate/libs/types';

export async function updateSingleRecord(dbModel: any, condition: object, dataToUpdate: object): Promise<boolean> {

    //Delete password
    delete dataToUpdate["password"];
    //Delete all ids
    delete dataToUpdate["_id"];

    //Set update timestamp---
    dataToUpdate['modifiedAt'] = Date.now();
    // ---
    //console.log("DATA TO UPDATE zzzzzzzzzzzzzzzzzzzzzzz", dataToUpdate)

    const data = await dbModel.updateOne(condition, { $set: dataToUpdate }, { runValidators: true, timestamps: false });
    // console.log("finalllllllllllllllllllllldata", data);
    if (parseInt(data.nModified) === 1) {
        return true;
    }
    else if (parseInt(data.nModified) === 0) {
        throw getISErrObj("Operation is failed to update!");
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}

export async function updateManyRecords(dbModel: any, condition: object, dataToUpdate: object): Promise<boolean> {

    //Delete password
    delete dataToUpdate["password"];
    //Delete all ids
    delete dataToUpdate["_id"];
    //Set update timestamp---
    dataToUpdate['modifiedAt'] = Date.now();
    // ---
    //console.log("data to multi update zzzzzzzzzzzzzzzzzzzzzzz", dataToUpdate)

    const data = await dbModel.updateMany(condition, { $set: dataToUpdate }, { runValidators: true, timestamps: false, multi: true });
    //console.log("finalllllllllllllllllllllldata many", data);
    if (parseInt(data.nModified) > 0) {
        return true;
    }
    else if (parseInt(data.nModified) === 0) {
        throw getISErrObj("Operation is failed to update!");
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}
export async function updatePasswordOnly(dbModel: any, condition: object, password: string): Promise<boolean> {

    const dataToUpdate = {
        password,
        token: "",//When password is updating, we always make the token as empty. in this way it becomes expired/invalid for further requests.
        //Set update timestamp---
        modifiedAt: Date.now()
    };
    const data = await dbModel.updateOne(condition, { $set: dataToUpdate }, { runValidators: true, timestamps: false });

    if (parseInt(data.nModified) === 1) {
        return true;
    }
    else if (parseInt(data.nModified) === 0) {
        throw getISErrObj("Operation is failed to update!");
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}

export async function updateEmailOnly(dbModel: any, condition: object, email: string): Promise<boolean> {

    const dataToUpdate = {
        email,
        //Set update timestamp---
        modifiedAt: Date.now()
    };
    const data = await dbModel.updateOne(condition, { $set: dataToUpdate }, { runValidators: true, timestamps: false });

    if (parseInt(data.nModified) === 1) {
        return true;
    }
    else if (parseInt(data.nModified) === 0) {
        throw getISErrObj("Operation is failed to update!");
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}

export async function increaseQuantityOfDbField(dbModel: any, condition: object, fieldToIncrease: string, quantityToIncrease: number): Promise<boolean> {

    const dataToIncrease = {
        [fieldToIncrease]: quantityToIncrease
    };

    const data = await dbModel.updateOne(condition, { $inc: dataToIncrease }, { timestamps: false });

    if (parseInt(data.nModified) === 1) {
        return true;
    }
    else if (parseInt(data.nModified) === 0) {
        throw getISErrObj("Operation is failed to update!");
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}

export async function pushSingleRecord(dbModel: any, condition: object, arrayFieldName: string, dataToPush: object): Promise<boolean> {

    const dbResult = await dbModel.updateOne(condition, { $addToSet: { [arrayFieldName]: { $each: [dataToPush] } } }, { runValidators: true, timestamps: false });
    // console.log("??????????????????????????true", dbResult);

    if (parseInt(dbResult.nModified) === 1) {
        return true;
    }
    else if (parseInt(dbResult.nModified) === 0) {
        throw getISErrObj("Operation is failed to update!");
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}





export async function getSingleRecord(dbModel: any, condition: object, projection: object = {}): Promise<IGetSingleRecord> {

    /*Note: findOne() method always return an object if condition is met
    otherwise/conditrion is not met it return null and if it has return null value and after
     that we write the code somewhere
     such as -> dbResult.length  =  means we are doing something like that -> null.length 
     then it will always break the code always
    */
    const dbResult = await dbModel.findOne(condition, projection).lean();
    if (dbResult) {
        return {
            record: dbResult,
            count: 1
        }
    } else {
        return {
            record: dbResult,
            count: 0
        }
    }
}



export async function getAllRecords(dbModel: any, condition: object, projection: object = {}, filters: string): Promise<any> {
    parseParamFilters(filters)
    const dbResult = await dbModel.find(condition, projection).skip().limit().sort().lean();
    // console.log("result>>>>>>>>>>>>>>>", result);

    return {
        record: dbResult,
        count: dbResult.length
    }
}

function parseParamFilters(filters: string) {

    let filtersObj = JSON.parse(filters);
    let limit = (typeof (filtersObj.limit) === "string") ? parseInt(filtersObj.limit) : filtersObj.limit;
    let pageNumber = (typeof (filtersObj.pageNumber) === "string") ? parseInt(filtersObj.pageNumber) : filtersObj.pageNumber;
    return {
        pageNumber: pageNumber,
        limit: limit,
        skip: (pageNumber - 1) * limit,
        sortBy: filtersObj.sortBy ? filtersObj.sortBy : "_id",
        sortingOrder: filtersObj.sortingOrder ? filtersObj.sortingOrder : -1,
        // isSearching: filtersObj.isSearching ? true : false,
    }
}

export async function checkIfAlreadyExists(dbModel, condition: object): Promise<boolean> {

    const dbResult = await dbModel.find(condition, {}).limit(1).lean();
    if (dbResult && dbResult.length > 0) {
        return true;
    } else if (dbResult.length == 0) {
        return false;
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}

export async function checkIfAlreadyExistsInOthereRecords(dbModel, condition: object, objId: string): Promise<boolean> {

    const dbResult = await dbModel.findOne(condition, {}).lean();
    if (dbResult) {
        //this means found in the current record can update it 
        if ((dbResult._id).toString() === objId.toString()) {
            // console.log("found in current555555555555555555555555555555555555555555");
            return false
        } else {
            //console.log("found in other66666666666666666666666666666666666666666");
            return true;
        }
    } else {
        return false;
    }
}

export async function checkIfAlreadyExistsWithOr(dbModel, condition: object, projection: object = {}): Promise<boolean> {

    const dbResult = await dbModel.find(condition, projection).limit(1).lean();
    if (dbResult && dbResult.length > 0) {
        let finalErr = "some fields are already exists!"
        const conditionArr = condition['$or'] ? condition['$or'] : [];
        conditionArr.map(obj => {
            for (let i in obj) {
                if (obj[i] === dbResult[0][i]) {
                    finalErr = `The ${i} '${obj[i]}' is alreday exists!`;
                    break;
                }
            }
        })
        throw getISErrObj(finalErr);

    } else if (dbResult.length == 0) {
        return false;
    } else {
        throw getISErrObj("Operation is failed due to db errors!");
    }
}

export async function createSingleRecord(dbModel, dataToCreate: object): Promise<ICreateSingleRecord> {

    let dbResult = await dbModel.create(dataToCreate);
    dbResult = dbResult.toObject();

    //delete password -> because we do not want to send password to front end
    delete dbResult['password'];
    if (dbResult) {
        return {
            record: dbResult,
            count: 1
        }
    }
}

export async function insertManyRecords(dbModel, dataArrayToInsert: Array<object>): Promise<ICreateSingleRecord> {

    //  1: If { ordered: false } in the following query then
    // for example - we are inserting 5 records and if 3rd record gets failed due to any reason 
    // then insertMany will continue for the 4th and 5th record insertion.
    // 2: And after the complete insertion of all 5 records it will go inside the catch block with the list of failed records.
    // 3: If all records are inserted without any error then only control will go inside try block.
    // 4: If any single record is failed and rest are inserted successfully then in this case control will also go inside the catch block.
    let dbResult = await dbModel.insertMany(dataArrayToInsert, { ordered: false });
    if (dbResult && dbResult.length > 0) {
        return {
            record: dbResult,
            count: dbResult.length
        }
    } else {
        return {
            record: [],
            count: 0
        }
    }
}


export async function getSingleRecordWithAggregate(dbModel: any, pipelines: Array<object>): Promise<IGetSingleRecord> {

    //note if no record is found then aggregate return empty array = [] so manage conditions accordingly
    const dbResult = await dbModel.aggregate(pipelines);
    if (dbResult && dbResult.length > 0) {
        return {
            record: dbResult[0], // because we will send object not array
            count: 1
        }
    } else {
        return {
            record: null,
            count: 0
        }
    }
}

export async function getAllRecordsWithAggregate(dbModel: any, pipelines: Array<object>, countCondition: object, needCount: boolean = true): Promise<IGetAllRecordsWithAggregate> {

    //Sometimes we need only records without count for this kind of cases 'needCount' flag is used
    const dbCount = needCount ? await dbModel.countDocuments(countCondition) : 0;
    const dbResult = await dbModel.aggregate(pipelines);
    if (dbResult && dbResult.length > 0) {
        return {
            records: dbResult,
            count: dbCount
        }
    } else {
        return {
            records: [],
            count: 0
        }
    }
}


/*
This is for those cases where we need to find records with aggregate and we do not 
want to apply pagination filters (where we need to count total records first then need to skip/limit)-- 
therefore we are not applying here count function because whichever documents would be returned
by db that would be total count

from services we can manage count for this query
*/
export async function findAllWithAggregate(dbModel: any, pipelines: Array<object>): Promise<IFindAllWithAggregate> {

    const dbResult = await dbModel.aggregate(pipelines);
    if (dbResult && dbResult.length > 0) {
        return {
            records: dbResult,
        }
    } else {
        return {
            records: []
        }
    }
}


export async function getAllRecordsWithFilters(dbModel: any, filters: any, projection: object): Promise<IGetAllRecordsWithFilters> {

    //1: get/declare all filters key coming with req
    let { condition, isSearching, searchingField, searchingData, pageNumber, limit, fetchVia, fetchOrder } = filters;
    //2: get skip
    const skip = getSkip(pageNumber, limit);
    //3: set sort object 
    const sort = { [fetchVia]: (fetchOrder === -1 || fetchOrder === 1) ? fetchOrder : -1 };
    //4: if searching then we append searching fields on condition object which is coming with req
    // we can pass regex conditon on req's condition but the regex condition is complex i writing so 
    // better approach write it at server side
    if (isSearching) {
        condition[searchingField] = { "$regex": getRegex(searchingData) };
    }

    const dbResult = await dbModel.find(condition, projection).skip(skip).limit(limit).sort(sort);
    const dbCount = await dbModel.countDocuments(condition);
    return {
        records: dbResult,
        count: dbCount
    }

}

export async function getCountOfSubDocuments(dbModel: any, conditon: object, subDocumentName: string): Promise<number> {

    const pipelines = [
        {
            '$match': conditon
        }, {
            '$project': {
                '_id': 0,
                'totalSubDocuments': {
                    '$size': '$' + subDocumentName
                }
            }
        }

    ];
    const dbResult = await dbModel.aggregate(pipelines);
    /*NOTE: If no record found then aggregate/dbResult will return => [] (empty array),
        so in that case dbResult[0].totalSubDocuments => would break the code.
        handling the situation using condirional operator below*/
    if (dbResult.length > 0) {
        return dbResult[0].totalSubDocuments;
    } else {
        return 0;
    }
}

export async function getCountWithAggreate(dbModel: any, pipelines: Array<object>): Promise<number> {

    const dbResult = await dbModel.aggregate(pipelines);

    if (dbResult.length > 0) {
        return dbResult.length
    } else {
        return 0;
    }
}

export async function getAllSubDocumentsWithFilters(dbModel: any, subDocumentName, filters: any, projection: object): Promise<IGetAllRecordsWithFilters> {

    //1: get/declare all filters key coming with req
    let { condition, isSearching, searchingField, searchingData, pageNumber, limit, fetchVia, fetchOrder } = filters;
    //2: get skip
    const skip = getSkip(pageNumber, limit);
    //3: set sort object 
    const sort = { [subDocumentName + "." + fetchVia]: (fetchOrder === -1 || fetchOrder === 1) ? fetchOrder : -1 };
    //4: if searching then we append searching fields on condition object which is coming with req
    // we can pass regex conditon on req's condition but the regex condition is complex i writing so 
    // better approach write it at server side
    if (isSearching) {
        condition[subDocumentName][searchingField] = { "$regex": getRegex(searchingData) };
    }


    const dbResult = await dbModel.aggregate([
        {
            '$match': condition
        },
        {
            '$project': {
                [subDocumentName]: 1
            }
        },
        {
            '$unwind': {
                'path': '$' + subDocumentName,
                'preserveNullAndEmptyArrays': true
            }
        },
        {
            '$skip': skip
        },
        {
            '$limit': limit
        },
        {
            '$sort': sort
        },
        {
            '$group': {
                _id: null,
                finalSubDocumentsArr: {
                    '$push': '$$ROOT' + "." + subDocumentName
                }
            }
        }
    ]);

    const dbCount = await getCountOfSubDocuments(dbModel, condition, subDocumentName);
    return {
        /*NOTE: If no record found then aggregate/dbResult will return => [] (empty array),
        so in that case dbResult[0].finalSubDocumentsArr => would break the code.
        handling the situation using ternary operator below*/
        records: dbResult.length > 0 ? dbResult[0].finalSubDocumentsArr : [],
        count: dbCount
    }
}

export const getFacetPipelines = (skip: number, limit: number): Array<object> => {
    return [
        {
            '$facet': {
                'paginationResult': [
                    {
                        '$skip': skip
                    }, {
                        '$limit': limit
                    }
                ],
                'countArr': [
                    {
                        '$count': 'count'
                    }
                ]
            }
        },
        {
            '$unwind': {
                'path': '$countArr',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$project': {
                'count': '$countArr.count',
                'paginationResult': '$paginationResult'
            }
        }
    ];
}

export const getRecordsFromFacetFilter = (dbResult: TCustomObj): IGetAllRecordsWithFilters => {
    const finalCount = dbResult.records.length ? dbResult.records[0].count : 0;
    const finalRecords = dbResult.records.length ? dbResult.records[0].paginationResult : [];
    return {
        records: finalRecords,
        count: finalCount
    }
}