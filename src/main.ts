import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { MaterialDesignIconsModule } from './app/core/ui/material-design-icons';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, { providers: [importProvidersFrom(HttpClientModule, MaterialDesignIconsModule)] });
