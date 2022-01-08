import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ], 
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class SharedModule { }
