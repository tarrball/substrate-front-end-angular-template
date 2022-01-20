import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { PointerLabelComponent } from './components/pointer-label/pointer-label.component';

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
