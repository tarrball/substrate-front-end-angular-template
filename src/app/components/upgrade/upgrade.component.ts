import { Component } from '@angular/core';

@Component({
    selector: 'app-upgrade',
    templateUrl: './upgrade.component.html',
    styleUrls: ['./upgrade.component.sass']
})
export class UpgradeComponent {

    constructor() { }

    public handleFileChosen(event: Event): void {
        console.log(event);
    }
}
