import { Component } from '@angular/core';

@Component({
    selector: 'app-interactor',
    templateUrl: './interactor.component.html',
    styleUrls: ['./interactor.component.sass']
})
export class InteractorComponent {

    public signedDisabled = false;

    public sudoDisabled = false;

    public unsignedDisabled = false;
}
