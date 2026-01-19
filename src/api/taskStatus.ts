import { sendGet, sendPost } from "./axios"
import { CreateTaskStatusDto, TaskStatus } from "@/interface/setting"

export const getTaskStatusesOfProject = async (projectId: string): Promise<TaskStatus[]> => {
    return sendGet(`/task-statuses/${projectId}`)
}

export const createTaskStatus = async (projectId: string, createTaskStatusDto: CreateTaskStatusDto): Promise<TaskStatus> => {
    return sendPost(`/task-statuses`, createTaskStatusDto, { projectId })
}