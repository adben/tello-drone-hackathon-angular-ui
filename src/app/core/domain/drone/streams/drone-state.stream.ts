import { Injectable } from '@angular/core';
import { createWebSocketStreamWithAutoReconnect } from 'src/app/core/utils/websocket';
import { FILTERED, ProxyObservable, cache, filterMap, readWebSocket } from 'src/app/shared/utils/rxjs';

import { DroneState } from '../models/drone-state.model';

@Injectable({ providedIn: 'root' })
export class DroneStateStream extends ProxyObservable<DroneState> {
    constructor() {
        super(
            createWebSocketStreamWithAutoReconnect(`ws://${location.host}/ws/drone/state`).pipe(
                readWebSocket(),
                filterMap(({ data }) => (typeof data === 'string' ? (JSON.parse(data) as DroneState) : FILTERED)),
                cache(),
            ),
        );
    }
}
