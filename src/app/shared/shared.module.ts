import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { PointerLabelComponent } from './components/pointer-label/pointer-label.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        PointerLabelComponent
    ],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [
        CommonModule,
        PointerLabelComponent,
        MaterialModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule { }
