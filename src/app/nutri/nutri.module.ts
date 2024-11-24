import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NutriPageRoutingModule } from './nutri-routing.module';

import { NutriPage } from './nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NutriPageRoutingModule
  ],
  declarations: [NutriPage]
})
export class NutriPageModule {}
