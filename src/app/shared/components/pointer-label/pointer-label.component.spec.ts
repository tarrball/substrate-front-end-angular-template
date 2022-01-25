import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointerLabelComponent } from './pointer-label.component';

describe('PointerLabelComponent', () => {
    let component: PointerLabelComponent;
    let fixture: ComponentFixture<PointerLabelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PointerLabelComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PointerLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
