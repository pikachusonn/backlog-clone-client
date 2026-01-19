export interface TaskStatus {
    color: string;
    id: string;
    isDefault: boolean;
    isDoneStatus: boolean;
    isEntryPoint: boolean;
    projectId: string;
    statusOrder: number;
    text: string;
}

export interface CreateTaskStatusDto {
    text: string;
    color: string;
}