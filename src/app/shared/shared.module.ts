import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ], 
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SharedModule { }
