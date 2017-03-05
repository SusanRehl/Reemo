import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'qs-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  routes: Object[] = [{
      title: 'Dashboard',
      route: '/',
      icon: 'dashboard',
    }, {
      title: 'Medications',
      route: '/product',
      icon: 'local_pharmacy',
    }, {
      title: 'Conditions',
      route: '/logs',
      icon: 'local_hospital',
    }, {
      title: 'Therapies',
      route: '/users',
      icon: 'directions_walk',
    }, {
      title: 'Settings',
      route: '/templates',
      icon: 'settings',
    },
  ];

  constructor(private _router: Router) {}

  logout(): void {
    this._router.navigate(['/login']);
  }
}
