import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BalancesComponent } from './components/balances/balances.component';
import { BlockNumberComponent } from './components/block-number/block-number.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { EventsComponent } from './components/events/events.component';
import { HeaderComponent } from './components/header/header.component';
import { InteractorComponent } from './components/interactor/interactor.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { NgModule } from '@angular/core';
import { NodeInfoComponent } from './components/node-info/node-info.component';
import { SharedModule } from './shared/shared.module';
import { TemplateModuleComponent } from './components/template-module/template-module.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';

@NgModule({
    declarations: [
        AccountSelectorComponent,
        AppComponent,
        BalancesComponent,
        BlockNumberComponent,
        HeaderComponent,
        MetadataComponent,
        NodeInfoComponent,
        InteractorComponent,
        TransferComponent,
        UpgradeComponent,
        EventsComponent,
        TemplateModuleComponent,
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
