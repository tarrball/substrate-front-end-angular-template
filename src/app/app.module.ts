import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockNumberComponent } from './components/block-number/block-number.component';
import { SharedModule } from './shared/shared.module';
import { MetadataComponent } from './components/metadata/metadata.component';
import { NodeInfoComponent } from './components/node-info/node-info.component';
import { BalancesComponent } from './components/balances/balances.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockNumberComponent,
    MetadataComponent,
    NodeInfoComponent,
    BalancesComponent
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
