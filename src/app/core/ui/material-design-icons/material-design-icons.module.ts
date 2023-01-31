import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule()
export class MaterialDesignIconsModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        console.log('Registering MDI SVG icon set...');
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
    }
}
