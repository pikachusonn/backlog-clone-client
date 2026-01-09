import { ICreateTaskPayload } from "@/interface/kanban";
import { sendGet, sendPost, sendPut } from "./axios"

export const getTasksOfProject = async (projectId: string) => {
    return sendGet(`/tasks/${projectId}`)
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