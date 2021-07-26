import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { CnaSettingsComponent } from './cnasettings/cnasettings.component';
import { PolSettingsComponent } from './polsettings/polsettings.component';
import { BookdetailComponent } from './bookdetail/bookdetail.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'cnasettings', component: CnaSettingsComponent },
  { path: 'polsettings', component: PolSettingsComponent },
  { path: 'bookdetail', component: BookdetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
