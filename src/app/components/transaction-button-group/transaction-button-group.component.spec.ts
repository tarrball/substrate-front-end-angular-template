import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionButtonGroupComponent } from './transaction-button-group.component';

describe('TransactionButtonGroupComponent', () => {
  let component: TransactionButtonGroupComponent;
  let fixture: ComponentFixture<TransactionButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionButtonGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
