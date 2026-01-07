export interface Task {
    id: string;
    name: string;
    description?: string;
    taskStatusId?: string;
    createdAt: string;
    updatedAt?: string;
    projectId: string;
    startDate?: string;
    dueDate?: string;
    assignee: Assignee;
}

export interface Assignee {
    id: string;
    status: string;
    targetAccount: TargetAccount;
    inviteDueDate?: string;
    createdAt: string;
    updatedAt?: string;
    projectRole: string;
}

export interface TargetAccount {
    id: string;
    email: string;
    createdAt: string;
    avatar?: string;
}

export interface ICreateTaskAttachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
}

export interface ICreateTaskPayload {
    projectId: string;
    assigneeId: string;
    taskName: string;
    description?: string;
    attachments: ICreateTaskAttachment[];
    startDate?: string;
    dueDate?: string;
}