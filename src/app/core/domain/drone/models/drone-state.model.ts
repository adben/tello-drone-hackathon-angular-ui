export interface DroneState {
    pitch: number;
    roll: number;
    yaw: number;
    speedX: number;
    speedY: number;
    speedZ: number;
    tempLow: number;
    tempHigh: number;
    tofDistance: number;
    height: number;
    battery: number;
    motorTime: number;
    barometer: number;
    accelerationX: number;
    accelerationY: number;
    accelerationZ: number;
}
