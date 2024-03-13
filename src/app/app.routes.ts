import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: 'page2', component: MapComponent },
];
