import { ICreateTaskPayload, IUpdateTaskPayload } from "@/interface/kanban";
import { sendGet, sendPatch, sendPost, sendPut } from "./axios"

export const getTasksOfProject = async (projectId: string) => {
    return sendGet(`/tasks/${projectId}`)
}

export const getTaskById = async (taskId: string) => {
    return sendGet(`/tasks/taskDetail/${taskId}`)
}
export const updateTaskAssignee = async ({ taskId, assigneeId }: { taskId: string, assigneeId: string }) => {
    return sendPut('/tasks/update-assignee', null, { taskId, assigneeId });
}

export const updateTaskStatus = async ({ taskId, statusId }: { taskId: string, statusId: string }) => {
    return sendPut('/tasks/update-status', null, { taskId, statusId });
}

export const createTask = async (payload: ICreateTaskPayload) => {
    return sendPost('/tasks', payload);
}

export const updateTask = async (taskId: string, payload: IUpdateTaskPayload) => {
    return sendPatch(`/tasks/update-task/${taskId}`, payload);
}