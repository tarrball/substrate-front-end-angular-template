import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockNumberComponent } from './components/block-number/block-number.component';
import { SharedModule } from './shared/shared.module';
import { NodeInfoComponent } from './components/node-info/node-info.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockNumberComponent,
    NodeInfoComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
