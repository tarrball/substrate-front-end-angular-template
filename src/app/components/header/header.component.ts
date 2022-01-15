import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="container">
      <img class="logo" src="../../../assets/substrate-logo.png">
      <app-account-selector></app-account-selector>
    </div>
  `,
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent {
}
