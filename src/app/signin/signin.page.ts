import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.servicetest';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  fullName: string = '';
  clockNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  confirmEmail: string = '';

  constructor(private router: Router, private firebaseService: FirebaseService, private alertController: AlertController) { }

  ngOnInit() { }

  signIn() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      alert('Passwords do not match');
      return;
    }
  
    if (this.email !== this.confirmEmail) {
      console.error('Email addresses do not match');
      alert('Email addresses do not match');
      return;
    }
  
    if (!this.fullName || !this.clockNumber || !this.password || !this.confirmPassword || !this.email || !this.confirmEmail) {
      console.error('Please fill in all fields');
      alert('Please fill in all fields');
      return;
    }
  
    // Validate the password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(this.password)) {
      console.error('Password does not meet requirements');
      alert('Password must have at least 6 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

  
    const newUser = {
      fullName: this.fullName,
      clockNumber: this.clockNumber,
      password: this.password,
      email: this.email
    };
  
    this.firebaseService.setCollection('usuarios', newUser)
      .then(() => {
        console.log('User registered successfully');
        alert('User registered successfully');
        this.router.navigate(['/login']);
        this.clearForm();
      })
      .catch(error => {
        console.error('Error registering user:', error);
      });

      
  }
  


  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  clearForm() {
    this.fullName = '';
    this.clockNumber = '';
    this.password = '';
    this.confirmPassword = '';
    this.email = '';
    this.confirmEmail = '';
  }
  async showPasswordAlert() {
    const alert = await this.alertController.create({
      header: 'Password requirements',
      message: 'Password must have at least 6 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.',
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
