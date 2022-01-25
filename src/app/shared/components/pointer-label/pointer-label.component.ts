import { Component, Input } from '@angular/core';

@Component({
    selector: 'shared-pointer-label',
    templateUrl: 'pointer-label.component.html',
    styleUrls: ['./pointer-label.component.sass']
})
export class PointerLabelComponent {

    @Input() public text: string = '';
}
