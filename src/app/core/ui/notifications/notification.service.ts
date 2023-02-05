import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorNotificationComponent } from './error-notification';

@Injectable()
export class NotificationService {
    constructor(private readonly snackBar: MatSnackBar) {}

    public showError(message: string): void {
        this.snackBar.openFromComponent(ErrorNotificationComponent, {
            data: { message },
            panelClass: 'error-notification',
            duration: 10000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
        });
    }
}
