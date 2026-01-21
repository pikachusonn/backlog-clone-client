import { CreateTransitionDto } from "@/interface/setting"
import { sendGet, sendPost } from "./axios"

export const getProjectTransitions = async (projectId: string) => {
    return sendGet(`/transitions/project/${projectId}`)
}

export const createTransition = async (payload: CreateTransitionDto) =>{
    return sendPost(`/transitions`, payload)
}