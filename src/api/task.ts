import { sendGet, sendPut } from "./axios"

export const getTasksOfProject = async (projectId: string) => {
    return sendGet(`/tasks/${projectId}`)
}

export const updateTaskAssignee = async ({ taskId, assigneeId }: { taskId: string, assigneeId: string }) => {
    return sendPut('/tasks', null, { taskId, assigneeId });
}