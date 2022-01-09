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
import { HeaderComponent } from './components/header/header.component';
import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { TransferButtonComponent } from './components/transfer-button/transfer-button.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockNumberComponent,
    MetadataComponent,
    NodeInfoComponent,
    BalancesComponent,
    HeaderComponent,
    AccountSelectorComponent,
    TransferComponent,
    TransferButtonComponent
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
