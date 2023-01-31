import { Observable, concat, retry, throwError, timeout } from 'rxjs';
import { cache, createWebSocketStream, withExponentialBackoff } from 'src/app/shared/utils/rxjs';

export function createWebSocketStreamWithAutoReconnect(url: string): Observable<WebSocket> {
    return createWebSocketStream(url).pipe(
        (webSocket$) =>
            concat(
                webSocket$.pipe(timeout({ first: 1000 })),
                throwError(() => Error('Websocket closed')),
            ),
        retry(withExponentialBackoff({ startDelay: 1000, maxDelay: 60000 })),
        cache(),
    );
}
