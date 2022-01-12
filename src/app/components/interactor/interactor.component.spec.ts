import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractorComponent } from './interactor.component';

describe('InteractorComponent', () => {
  let component: InteractorComponent;
  let fixture: ComponentFixture<InteractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
