import { ICreateTaskPayload } from "@/interface/kanban";
import { sendGet, sendPost, sendPut } from "./axios"

export const getTasksOfProject = async (projectId: string) => {
    return sendGet(`/tasks/${projectId}`)
}

export const updateTaskAssignee = async ({ taskId, assigneeId }: { taskId: string, assigneeId: string }) => {
    return sendPut('/tasks', null, { taskId, assigneeId });
}

export const createTask = async (payload: ICreateTaskPayload) => {
    return sendPost('/tasks', payload);
}