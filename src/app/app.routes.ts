import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
    { path: 'page1', component: AppComponent },
    { path: 'page2', component: MapComponent },
];
