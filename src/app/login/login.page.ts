import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  clockNumber: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() { }

  async login() {
    this.firebaseService.getCollectionByClockNumberAndPassword('usuarios', this.clockNumber, this.password).subscribe(async (users: any[]) => {
      if (users.length > 0) {
        this.userService.setUser(users[0]); 
        await this.router.navigate(['/menu']); 
        this.clearLoginForm(); 
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Invalid credentials',
          buttons: ['OK']
        });
        await alert.present();
        this.clearLoginForm(); 
      }
    });
  }



  
  clearLoginForm() {
    this.clockNumber = '';
    this.password = '';
  }
  async navigateToSignIn() {
    await this.router.navigate(['/signin']); 
  }
}
