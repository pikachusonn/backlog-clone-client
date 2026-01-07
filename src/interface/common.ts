export interface TaskStatus {
    id: string;
    text: string;
    color: string;
    isDefault: boolean;
    isDoneStatus: boolean;
    statusOrder: number;
}

export interface projectCollaborator {
    id: string;
    status: string;
    inviteDueDate?: string;
    createdAt: string;
    updatedAt?: string;
    projectRole: string;
    targetAccount: {
        id: string;
        email: string;
        createdAt: string;
        avatar?: string;
    };
}
export interface ProjectDetails {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    coverImage?: string;
    createdByAccount: {
        id: string;
        email: string;
        createdAt: string;
        avatarUrl?: string;
    };
    projectRole?: string;
    taskStatuses: TaskStatus[];
    projectCollaborators: projectCollaborator[];
}

export interface SelectItem {
    label: string;
    value: string;
}