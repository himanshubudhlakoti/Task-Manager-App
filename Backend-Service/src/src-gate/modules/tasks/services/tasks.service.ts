import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as mongoose from 'mongoose';
import { IOkResponse, ICreatedResponse, IUpdatedResponse, IFindAllWithAggregate } from "src/src-gate/libs/interfaces";
import { getCreatedResObj, getOkResObj, getUpdatedResObj } from "src/src-gate/libs/functions/response";
import { DatabaseService } from "../../database/services/database.service";
import { createSingleRecord, findAllWithAggregate, updateSingleRecord } from "src/src-gate/libs/functions/db.queries";
import { TCustomObj } from 'src/src-gate/libs/types';
import { TaskStatuses } from "src/src-gate/libs/constants/enums";
import { assignATaskToEmployeeDto, createTaskByEmployeeDto, updateTaskDto } from '../dto';

@Injectable()
export class TasksService {

    constructor(private databaseService: DatabaseService) { }

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

    async deleteTask(taskId: string): Promise<IUpdatedResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const condition: { _id: mongoose.Types.ObjectId } = { _id: mongoose.Types.ObjectId(taskId) };
        const dataToUpdate: { isDeleted: boolean } = { isDeleted: true };
        await updateSingleRecord(TASK_MODEL, condition, dataToUpdate);
        return getUpdatedResObj();
    }

    async getEmployeeTasks(req: any): Promise<IOkResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const employeeId: string = req['CURRENT_USER']['USER_ID'];
        const pipeline: any[] = [
            {
                $match: {
                    assignedToId: mongoose.Types.ObjectId(employeeId),
                    isDeleted: false
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
                    assignedToId: mongoose.Types.ObjectId(employeeId),
                    isDeleted: false
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

    async getTeamLeadTasksById(teamLeadId: string): Promise<IOkResponse> {

        const { TASK_MODEL } = this.databaseService.getDbModels();
        const pipeline: any[] = [
            {
                $match: {
                    assignedToId: mongoose.Types.ObjectId(teamLeadId),
                    isDeleted: false
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
