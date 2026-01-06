import { ProjectDetails } from "@/interface/common";
import { sendGet } from "./axios"

export const getParticipatedProjects = async () => {
    return sendGet('/projects/participated')
}

export const getProjectDetails = async (projectId: string): Promise<ProjectDetails> => {
    return sendGet(`/projects/detail`, { projectId });
}