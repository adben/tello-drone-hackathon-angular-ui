import { Observable } from 'rxjs';

export function createWebSocketStream(url: string | URL, protocols?: string | string[]): Observable<WebSocket> {
    return new Observable<WebSocket>((subscriber) => {
        const websocket = new WebSocket(url, protocols);

        function onOpen(): void {
            subscriber.next(websocket);
        }

        function onClose(): void {
            subscriber.complete();
        }

        function onError(): void {
            subscriber.error();
        }

        websocket.addEventListener('open', onOpen);
        websocket.addEventListener('close', onClose);
        websocket.addEventListener('error', onError);

        return () => {
            websocket.removeEventListener('open', onOpen);
            websocket.removeEventListener('close', onClose);
            websocket.removeEventListener('error', onError);

            websocket.close();
        };
    });
}
