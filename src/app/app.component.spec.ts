import { EMPTY, from, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { NodeService } from './services/node.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

let nodeServiceSpy: jasmine.SpyObj<NodeService>;

describe('AppComponent Smoke Test', () => {
    beforeEach(async () => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['connectToNode']);
        nodeServiceSpy.connectToNode.and.returnValue(EMPTY);

        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [{
                provider: NodeService, useValue: nodeServiceSpy
            }]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});

describe('AppComponent Unit Tests', () => {
    let component: AppComponent;

    beforeEach(() => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['connectToNode']);

        component = new AppComponent(nodeServiceSpy);
    });

    describe('ngOnInit', () => {
        it('should connect to the node', () => {
            nodeServiceSpy.connectToNode.and.returnValue(EMPTY);

            component.ngOnInit();

            expect(nodeServiceSpy.connectToNode).toHaveBeenCalled();
        });

        it(`should set 'isConnected' to true on success`, () => {
            const state = { value: 'success!' } as any;

            nodeServiceSpy.connectToNode.and.returnValue(from([state]));

            component.ngOnInit();

            expect(component.isConnected).toBeTrue();
        });

        it(`should set 'isConnected' to false on failure`, () => {
            component.isConnected = true;

            nodeServiceSpy.connectToNode
                .and
                .returnValue(throwError(() => new Error('connection failed')));

            component.ngOnInit();

            expect(component.isConnected).toBeFalse();
        });
    });
});