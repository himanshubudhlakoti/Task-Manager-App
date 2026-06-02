import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SubHeaderComponent } from './components/sub-header/sub-header.component';

@NgModule({
  declarations: [
    SubHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],

  providers: [
  ],
  exports: [
    SubHeaderComponent
  ]
})
export class SubHeaderModule { }
