import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { MaterialDesignIconsModule } from './app/core/ui/material-design-icons';
import { NotificationModule } from './app/core/ui/notifications';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(BrowserAnimationsModule, HttpClientModule, MaterialDesignIconsModule, NotificationModule)],
});
