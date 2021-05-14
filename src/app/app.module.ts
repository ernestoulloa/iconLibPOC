import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IconComponent} from './components/icon.component';
import {HttpClientModule} from '@angular/common/http';
import {SvgIconsModule} from '@ngneat/svg-icon';
import {IconsRegistryModule} from './icons-registry.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    IconsRegistryModule,
    SvgIconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
