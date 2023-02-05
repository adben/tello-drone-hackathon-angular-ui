import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { NotificationService } from '../ui/notifications';

@Injectable({ providedIn: 'root' })
export class ErrorNotificationHttpInterceptor implements HttpInterceptor {
    constructor(private readonly notificationService: NotificationService) {}

    public intercept(request: HttpRequest<unknown>, nextHandler: HttpHandler): Observable<HttpEvent<unknown>> {
        return nextHandler.handle(request).pipe(
            catchError((error: unknown) => {
                const errorMessage = this.extractErrorMessage(error);

                if (errorMessage !== undefined) {
                    this.notificationService.showError(errorMessage);
                }

                return throwError(() => error);
            }),
        );
    }

    private extractErrorMessage(error: unknown): string | undefined {
        if (error instanceof HttpErrorResponse) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const message = error.error?._embedded?.errors?.[0]?.message;

            if (typeof message === 'string') {
                return message;
            }
        }

        return undefined;
    }
}
