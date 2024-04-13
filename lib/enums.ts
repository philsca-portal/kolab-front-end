namespace $Enums {
    export enum TaskStatus {
        PENDING = 'PENDING',
        ON_GOING = 'ON_GOING',
        IN_REVIEW = 'IN_REVIEW',
        COMPLETED = 'COMPLETED',
        EXPIRED = 'EXPIRED'
    }

    export enum TaskPriority {
        LOW = 'LOW',
        NORMAL = 'NORMAL',
        HIGH = 'HIGH',
        URGENT = 'URGENT'
    }
    
    export enum StatusType {
        READ = 'READ',
        UNREAD = 'UNREAD'
    }
}

export { $Enums };