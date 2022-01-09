import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferButtonComponent } from './transfer-button.component';

describe('TransferButtonComponent', () => {
  let component: TransferButtonComponent;
  let fixture: ComponentFixture<TransferButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
