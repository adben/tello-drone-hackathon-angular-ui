import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { commit } from 'src/app/shared/utils/rxjs';

@Injectable({ providedIn: 'root' })
export class DroneService {
    constructor(private readonly httpClient: HttpClient) {}

    public connect(): Observable<void> {
        return this.httpClient.get('/api/drone/connect').pipe(
            map(() => undefined),
            commit(),
        );
    }

    public disconnect(): Observable<void> {
        return this.httpClient.get('/api/drone/disconnect').pipe(
            map(() => undefined),
            commit(),
        );
    }

    public startVideoStream(): Observable<void> {
        return this.httpClient.get('/api/drone/video/start').pipe(
            map(() => undefined),
            commit(),
        );
    }

    public stopVideoStream(): Observable<void> {
        return this.httpClient.get('/api/drone/video/stop').pipe(
            map(() => undefined),
            commit(),
        );
    }
}
