import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as mongoose from 'mongoose';
import { IOkResponse, ICreatedResponse, IUpdatedResponse, ICreateSingleRecord, IFindAllWithAggregate, IGetAllRecordsWithFilters } from "src/src-gate/libs/interfaces";
import { getCreatedResObj, getOkResObj, getUpdatedResObj, getISErrObj } from "src/src-gate/libs/functions/response";
import { DatabaseService } from "../../database/services/database.service";
import { updateEmailOnly, getSingleRecord, updateManyRecords, getAllRecordsWithAggregate, createSingleRecord, checkIfAlreadyExists, getRecordsFromFacetFilter, getFacetPipelines, findAllWithAggregate, updateSingleRecord, checkIfAlreadyExistsInOthereRecords, insertManyRecords } from "src/src-gate/libs/functions/db.queries";
import { getParsedObj, getSkip, getRegex, validateBody } from "src/src-gate/libs/functions/validators";
import { TCustomObj } from 'src/src-gate/libs/types';
import { UserRoles, TaskStatuses } from "src/src-gate/libs/constants/enums";
import { assignATaskToEmployeeDto, createTaskByEmployeeDto, createTaskDto, updateTaskDto } from '../dto';

@Injectable()
export class TasksService {

    constructor(private databaseService: DatabaseService) { }


    async createTask(req, taskData: createTaskDto): Promise<ICreatedResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        const assignedById: string = req['CURRENT_USER']['_id'];
        const dataToInsert: createTaskDto & { assignedById: string } = { ...taskData, assignedById };
        await createSingleRecord(USER_MODEL, dataToInsert);
        return getCreatedResObj({});
    }


    async getEmployeeTodos(employeeId: string): Promise<IOkResponse> {

        const { USER_MODEL } = this.databaseService.getDbModels();
        const pipeline: any[] = [
            {
                $match: {
                    _id: employeeId,
                    role: UserRoles.EMPLOYEE
                }
            },
            // Self lookup to get Team Lead
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
            // Get employee's todos
            {
                $lookup: {
                    from: 'todos',
                    localField: '_id',
                    foreignField: 'assignedToId',
                    as: 'todos'
                }
            },
            {
                $project: {
                    password: 0,
                    token: 0,
                    'teamLead.password': 0,
                    'teamLead.token': 0
                }
            }
        ];
        const dbResult = await findAllWithAggregate(USER_MODEL, pipeline);
        return getOkResObj(dbResult.records, 1);
    }

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
                '$sort': { [fetchVia]: fetchOrder }
            },
            ...getFacetPipelines(skip, limit)

        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(USER_MODEL, pipeline);
        let filteredRecords: IGetAllRecordsWithFilters = getRecordsFromFacetFilter(dbResult);
        return getOkResObj(filteredRecords.records, filteredRecords.count);
    }

    async createTaskForSelf(req: any, taskData: createTaskByEmployeeDto): Promise<ICreatedResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const currentUserId: string = req['CURRENT_USER']['USER_ID'];
        const assignedToId: mongoose.Types.ObjectId = mongoose.Types.ObjectId(currentUserId);
        const assignedById: mongoose.Types.ObjectId = mongoose.Types.ObjectId(currentUserId);
        await createSingleRecord(TASK_MODEL, { ...taskData, assignedToId, assignedById });
        return getCreatedResObj({});
    }

    async assignATaskToEmployeeByTeamLead(req: any, taskData: assignATaskToEmployeeDto): Promise<ICreatedResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const currentUserId: string = req['CURRENT_USER']['USER_ID'];
        const assignedById: mongoose.Types.ObjectId = mongoose.Types.ObjectId(currentUserId);
        const assignedToId: mongoose.Types.ObjectId = mongoose.Types.ObjectId(taskData.assignedToId);
        await createSingleRecord(TASK_MODEL, { ...taskData, assignedById, assignedToId });
        return getCreatedResObj({});
    }

    async updateTask(taskId: string, taskData: updateTaskDto): Promise<IUpdatedResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const condition: { _id: string } = { _id: taskId };
        await updateSingleRecord(TASK_MODEL, condition, taskData);
        return getUpdatedResObj();
    }

    async getEmployeeTasks(req: any): Promise<IOkResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const employeeId: string = req['CURRENT_USER']['USER_ID'];
        const pipeline: any[] = [
            {
                $match: {
                    assignedToId: mongoose.Types.ObjectId(employeeId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedById',
                    foreignField: '_id',
                    as: 'assignedBy'
                }
            },
            {
                $unwind: {
                    path: '$assignedBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    assignedById: 1,
                    assignedToId: 1,
                    assignedByName: {
                        $concat: [
                            '$assignedBy.fName',
                            ' ',
                            '$assignedBy.lName'
                        ]
                    },
                    title: 1,
                    description: 1,
                    status: 1,
                    addedAt: 1,
                    modifiedAt: 1
                }
            },
            {
                '$sort': { modifiedAt: -1 }
            },
            {
                '$group': {
                    _id: '$status',
                    tasks: {
                        $push: {
                            _id: '$_id',
                            title: '$title',
                            description: '$description',
                            assignedById: '$assignedById',
                            assignedToId: '$assignedToId',
                            assignedByName: '$assignedByName',
                            status: '$status',
                            addedAt: '$addedAt',
                            modifiedAt: '$modifiedAt'
                        }
                    }
                }
            }
        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(TASK_MODEL, pipeline);
        const result: TCustomObj = {
            pending: [],
            inProgress: [],
            completed: []
        };
        dbResult.records.forEach(item => {
            switch (item._id) {
                case TaskStatuses.PENDING:
                    result.pending = item.tasks;
                    break;

                case TaskStatuses.IN_PROGRESS:
                    result.inProgress = item.tasks;
                    break;

                case TaskStatuses.COMPLETED:
                    result.completed = item.tasks;
                    break;
            }
        });
        return getOkResObj(result, 1);
    }

    async getEmployeeTasksById(req: Request, employeeId: string): Promise<IOkResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const currentUserId: string = req['CURRENT_USER']['USER_ID'];
        const pipeline: any[] = [
            {
                $match: {
                    assignedById: mongoose.Types.ObjectId(currentUserId),
                    assignedToId: mongoose.Types.ObjectId(employeeId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedById',
                    foreignField: '_id',
                    as: 'assignedBy'
                }
            },
            {
                $unwind: {
                    path: '$assignedBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    assignedById: 1,
                    assignedToId: 1,
                    assignedByName: {
                        $concat: [
                            '$assignedBy.fName',
                            ' ',
                            '$assignedBy.lName'
                        ]
                    },
                    title: 1,
                    description: 1,
                    status: 1,
                    addedAt: 1,
                    modifiedAt: 1
                }
            },
            {
                '$sort': { modifiedAt: -1 }
            },
            {
                '$group': {
                    _id: '$status',
                    tasks: {
                        $push: {
                            _id: '$_id',
                            title: '$title',
                            description: '$description',
                            assignedById: '$assignedById',
                            assignedToId: '$assignedToId',
                            assignedByName: '$assignedByName',
                            status: '$status',
                            addedAt: '$addedAt',
                            modifiedAt: '$modifiedAt'
                        }
                    }
                }
            }
        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(TASK_MODEL, pipeline);
        const result: TCustomObj = {
            pending: [],
            inProgress: [],
            completed: []
        };
        dbResult.records.forEach(item => {
            switch (item._id) {
                case TaskStatuses.PENDING:
                    result.pending = item.tasks;
                    break;

                case TaskStatuses.IN_PROGRESS:
                    result.inProgress = item.tasks;
                    break;

                case TaskStatuses.COMPLETED:
                    result.completed = item.tasks;
                    break;
            }
        });
        return getOkResObj(result, 1);
    }

    async getTeamLeadTasksById(req: Request, teamLeadId: string): Promise<IOkResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const pipeline: any[] = [
            {
                $match: {
                    assignedToId: mongoose.Types.ObjectId(teamLeadId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedById',
                    foreignField: '_id',
                    as: 'assignedBy'
                }
            },
            {
                $unwind: {
                    path: '$assignedBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    assignedById: 1,
                    assignedToId: 1,
                    assignedByName: {
                        $concat: [
                            '$assignedBy.fName',
                            ' ',
                            '$assignedBy.lName'
                        ]
                    },
                    title: 1,
                    description: 1,
                    status: 1,
                    addedAt: 1,
                    modifiedAt: 1
                }
            },
            {
                '$sort': { modifiedAt: -1 }
            },
            {
                '$group': {
                    _id: '$status',
                    tasks: {
                        $push: {
                            _id: '$_id',
                            title: '$title',
                            description: '$description',
                            assignedById: '$assignedById',
                            assignedToId: '$assignedToId',
                            assignedByName: '$assignedByName',
                            status: '$status',
                            addedAt: '$addedAt',
                            modifiedAt: '$modifiedAt'
                        }
                    }
                }
            }
        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(TASK_MODEL, pipeline);
        const result: TCustomObj = {
            pending: [],
            inProgress: [],
            completed: []
        };
        dbResult.records.forEach(item => {
            switch (item._id) {
                case TaskStatuses.PENDING:
                    result.pending = item.tasks;
                    break;

                case TaskStatuses.IN_PROGRESS:
                    result.inProgress = item.tasks;
                    break;

                case TaskStatuses.COMPLETED:
                    result.completed = item.tasks;
                    break;
            }
        });
        return getOkResObj(result, 1);
    }

    async getTeamLeadEmployeesTasks(req: any): Promise<IOkResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const currentUserId: string = req['CURRENT_USER']['USER_ID'];
        const pipeline: any[] = [
            {
                $match: {
                    assignedById: mongoose.Types.ObjectId(currentUserId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedToId',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $unwind: {
                    path: '$employee',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    assignedById: 1,
                    assignedToId: 1,
                    assignedByName: {
                        $concat: [
                            '$employee.fName',
                            ' ',
                            '$employee.lName'
                        ]
                    },
                    title: 1,
                    description: 1,
                    status: 1,
                    addedAt: 1,
                    modifiedAt: 1
                }
            },
            {
                '$sort': { modifiedAt: -1 }
            },
            {
                '$group': {
                    _id: '$status',
                    tasks: {
                        $push: {
                            _id: '$_id',
                            title: '$title',
                            description: '$description',
                            assignedById: '$assignedById',
                            assignedToId: '$assignedToId',
                            assignedByName: '$assignedByName',
                            status: '$status',
                            addedAt: '$addedAt',
                            modifiedAt: '$modifiedAt'
                        }
                    }
                }
            }
        ];
        const dbResult: IFindAllWithAggregate = await findAllWithAggregate(TASK_MODEL, pipeline);
        const result: TCustomObj = {
            pending: [],
            inProgress: [],
            completed: []
        };
        dbResult.records.forEach(item => {
            switch (item._id) {
                case TaskStatuses.PENDING:
                    result.pending = item.tasks;
                    break;

                case TaskStatuses.IN_PROGRESS:
                    result.inProgress = item.tasks;
                    break;

                case TaskStatuses.COMPLETED:
                    result.completed = item.tasks;
                    break;
            }
        });
        return getOkResObj(result, 1);
    }
}
