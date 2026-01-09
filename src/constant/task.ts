export enum TASK_PRIORITY {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum TASK_TYPE {
    BUG = 'BUG',
    TASK = 'TASK',
}

export const TASK_TYPE_OPTIONS = [
    {
        label: 'Bug',
        value: TASK_TYPE.BUG,
    },
    {
        label: 'Task',
        value: TASK_TYPE.TASK,
    },
]

export const TASK_PRIORITY_OPTIONS = [
    {
        label: 'Low',
        value: TASK_PRIORITY.LOW,
    },
    {
        label: 'Medium',
        value: TASK_PRIORITY.MEDIUM,
    },
    {
        label: 'High',
        value: TASK_PRIORITY.HIGH,
    },
]