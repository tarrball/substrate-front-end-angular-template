import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateModuleComponent } from './template-module.component';

describe('TemplateModuleComponent', () => {
    let component: TemplateModuleComponent;
    let fixture: ComponentFixture<TemplateModuleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TemplateModuleComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TemplateModuleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
