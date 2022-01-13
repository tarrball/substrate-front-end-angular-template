import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interactor',
  templateUrl: './interactor.component.html',
  styleUrls: ['./interactor.component.sass']
})
export class InteractorComponent implements OnInit {

  public signedDisabled = false;

  public sudoDisabled = false;

  public unsignedDisabled = false;

  constructor() { }

  public ngOnInit(): void {
    console.log('InteractorComponent ngOnInit');
  }
}
