import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Request } from 'express';
import { IOkResponse, IUpdatedResponse, IFindAllWithAggregate, IGetAllRecordsWithFilters } from "src/src-gate/libs/interfaces";
import { getOkResObj, getUpdatedResObj, getISErrObj } from "src/src-gate/libs/functions/response";
import { DatabaseService } from "../../database/services/database.service";
import { updateManyRecords, getRecordsFromFacetFilter, getFacetPipelines, findAllWithAggregate, updateSingleRecord, getSingleRecord } from "src/src-gate/libs/functions/db.queries";
import { getParsedObj, getSkip } from "src/src-gate/libs/functions/validators";
import { TCustomObj } from 'src/src-gate/libs/types';
import { UserRoles } from "src/src-gate/libs/constants/enums";
import { createAssignLeaderDto } from '../dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {

    constructor(private databaseService: DatabaseService) { }

    async getUsersList(role: UserRoles, query: { filters: string }): Promise<IOkResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        const filters = getParsedObj(query.filters);

        let serverCondition = {
            role: role
        };
        const { limit, pageNumber, fetchVia, fetchOrder } = filters;
        const skip = getSkip(pageNumber, limit);

        const pipeline: any[] = [
            {
                $match: serverCondition
            },
            {
                $project: {
                    password: 0,
                    token: 0
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'teamLeadId',
                    foreignField: '_id',
                    as: 'teamLead'
                }
            },
            {
                $unwind: {
                    path: '$teamLead',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$project': {

                    'teamLead.password': 0,
                    'teamLead.token': 0
                }
            },
            {
                '$sort': { [fetchVia]: fetchOrder }
            },
            ...getFacetPipelines(skip, limit)

        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(USER_MODEL, pipeline);
        let filteredRecords: IGetAllRecordsWithFilters = getRecordsFromFacetFilter(dbResult);
        return getOkResObj(filteredRecords.records, filteredRecords.count);
    }

    async getTeamLeadEmployees(req: Request): Promise<IOkResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        const currentUserId = req['CURRENT_USER']['USER_ID'];
        if (!currentUserId) {
            throw getISErrObj("Invalid user id in token!");
        }
        const serverCondition: { teamLeadId: Types.ObjectId } = {
            teamLeadId: mongoose.Types.ObjectId(currentUserId)
        };
        const pipeline: any[] = [
            {
                $match: serverCondition
            },
            {
                $project: {
                    password: 0,
                    token: 0
                }
            },
            {
                '$sort': { _id: -1 }
            },
        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(USER_MODEL, pipeline);
        return getOkResObj(dbResult.records, dbResult.records.length);
    }

    async getTeamLeads(): Promise<IOkResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        const serverCondition: { role: UserRoles } = {
            role: UserRoles.TEAM_LEADER
        };
        const pipeline: any[] = [
            {
                $match: serverCondition
            },
            {
                $project: {
                    password: 0,
                    token: 0
                }
            },
            {
                '$sort': { _id: -1 }
            },
        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(USER_MODEL, pipeline);
        return getOkResObj(dbResult.records, dbResult.records.length);
    }

    async assignLeader(body: createAssignLeaderDto): Promise<IUpdatedResponse> {

        const { USER_MODEL, TASK_MODEL } = this.databaseService.getDbModels();
        const employeeIds: string[] = body.employeeIds;

        for (let employeeId of employeeIds) {

            const conditonToUpdateAtUserCollection: {

                _id: string,
                role: UserRoles
            } = {
                _id: employeeId,
                role: UserRoles.EMPLOYEE
            }

            const dataToUpdateAtUserCollection: { teamLeadId: mongoose.Types.ObjectId } =
            {
                teamLeadId: mongoose.Types.ObjectId(body.teamLeadId)
            };
            await updateSingleRecord(USER_MODEL, conditonToUpdateAtUserCollection, dataToUpdateAtUserCollection);

            //Update to task collection
            const conditonToUpdateAtTaskCollection: {

                assignedToId: mongoose.Types.ObjectId,
                assignedById: TCustomObj
            } = {
                assignedToId: mongoose.Types.ObjectId(employeeId),
                assignedById: { '$ne': mongoose.Types.ObjectId(employeeId) }
            };
            const dataToUpdateAtTaskCollection: {

                assignedById: mongoose.Types.ObjectId
            } = {
                assignedById: mongoose.Types.ObjectId(body.teamLeadId)
            };
            const result = (await getSingleRecord(TASK_MODEL, conditonToUpdateAtTaskCollection)).record
            if (result) {
                await updateManyRecords(TASK_MODEL, conditonToUpdateAtTaskCollection, dataToUpdateAtTaskCollection);
            }
        }
        return getUpdatedResObj();
    }
}
