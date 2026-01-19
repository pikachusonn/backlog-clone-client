import { sendGet } from "./axios"

export const getProjectTransitions = async (projectId: string) => {
    return sendGet(`/transitions/project/${projectId}`)
}