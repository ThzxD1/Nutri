import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NutriPage } from './nutri.page';

const routes: Routes = [
  {
    path: '',
    component: NutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NutriPageRoutingModule {}
