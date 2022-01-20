import { Component, Input } from '@angular/core';

@Component({
    selector: 'shared-pointer-label',
    template: `    
      <mat-icon>double_arrow</mat-icon>
      <label>{{text}}</label>
  `,
    styleUrls: ['./pointer-label.component.sass']
})
export class PointerLabelComponent{

  @Input() public text: string = '';
}
