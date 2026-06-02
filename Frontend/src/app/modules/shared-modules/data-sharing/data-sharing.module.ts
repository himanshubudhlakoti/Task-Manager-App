import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSharingService } from "./services/data-sharing.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [DataSharingService],
})
export class DataSharingModule { }
