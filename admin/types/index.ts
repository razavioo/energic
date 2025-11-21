export interface SensorData {
    level: number;
    percentage: number;
    capacity: number;
    isFilling: boolean;
    isEmptying: boolean;
    hardness: number;
    timestamp: number;
}

export interface SensorCommand {
    action: 'START_FILL' | 'STOP_FILL' | 'START_EMPTY' | 'STOP_EMPTY' | 'SET_LEVEL' | 'CONFIGURE';
    value?: number;
    capacity?: number;
    hardness?: number;
}
