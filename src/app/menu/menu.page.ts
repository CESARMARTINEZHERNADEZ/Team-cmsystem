// menu.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/User.Service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
