import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.servicetest';
import { UserService } from '../services/User.Service';
import { Router } from '@angular/router';

interface User {
  id: string;
  clockNumber: string;
  email: string;
  fullName: string;
  rol: string;
  password: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss', '../app.component.scss'],
})
export class UserPage implements OnInit {
  users: User[] = [];

  constructor(
    public alertController: AlertController,
    private firebaseService: FirebaseService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    if (!user || !this.userService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
    this.loadUsers();
  }

  
  logout() {
    this.userService.clearUser();
    this.router.navigate(['/dashboard']);
  }

  loadUsers() {
    this.firebaseService.getCollectionlife('usuarios').subscribe((users: User[]) => {
      this.users = users;
    });
  }

  async addUser() {
    const alert = await this.alertController.create({
      header: 'Add New User',
      inputs: [
        { name: 'fullName', type: 'text', placeholder: 'Full Name' },
        { name: 'clockNumber', type: 'text', placeholder: 'Clock Number' },
        { name: 'password', type: 'password', placeholder: 'Password' },
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'rol', type: 'text', placeholder: 'Role' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: async (data) => {
            const password = data.password + '!';  // Añadir un '!' para forzar la validación
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

            if (!password.match(passwordRegex)) {
              const alert = await this.alertController.create({
                header: 'Invalid Password',
                message: 'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
                buttons: ['OK']
              });
              await alert.present();
              return false;
            }

            if (!data.fullName || !data.clockNumber || !data.password || !data.email || !data.rol) {
              const alert = await this.alertController.create({
                header: 'Missing Fields',
                message: 'All fields must be filled out. Please complete the form.',
                buttons: ['OK']
              });
              await alert.present();
              return false;
            }

            const newUserId = this.firebaseService.generateDocId('usuarios');
            const newUser: User = {
              id: newUserId,
              clockNumber: data.clockNumber,
              email: data.email,
              fullName: data.fullName,
              rol: data.rol,
              password: data.password,
            };

            await this.firebaseService.setCollectionlife('usuarios', newUser, newUserId);
            this.loadUsers();
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  async editUser(user: User) {
    const alert = await this.alertController.create({
      header: 'Edit User',
      inputs: [
        { name: 'clockNumber', value: user.clockNumber, placeholder: 'Clock Number' },
        { name: 'email', value: user.email, placeholder: 'Email' },
        { name: 'fullName', value: user.fullName, placeholder: 'Full Name' },
        { name: 'rol', value: user.rol, placeholder: 'Role' },
        { name: 'password', type: 'password', placeholder: 'Password' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            const password = data.password;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

            if (password && !password.match(passwordRegex)) {
              const alert = await this.alertController.create({
                header: 'Invalid Password',
                message: 'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
                buttons: ['OK']
              });
              await alert.present();
              return false;
            }

            if (!data.fullName || !data.clockNumber || !data.email || !data.rol) {
              const alert = await this.alertController.create({
                header: 'Missing Fields',
                message: 'All fields must be filled out. Please complete the form.',
                buttons: ['OK']
              });
              await alert.present();
              return false;
            }

            const updatedData: Partial<User> = {
              clockNumber: data.clockNumber,
              email: data.email,
              fullName: data.fullName,
              rol: data.rol,
              password: password,
            };

            this.updateUser(user.id, updatedData);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  updateUser(userId: string, data: Partial<User>) {
    this.firebaseService.updateDocument('usuarios', userId, data).then(() => {
      console.log('User updated');
      this.loadUsers();
    });
  }

  async deleteUser(userId: string) {
    const alert = await this.alertController.create({
      header: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: async () => {
            await this.firebaseService.deleteDocument('usuarios', userId);
            console.log('User deleted');
            this.loadUsers();
          }
        }
      ]
    });

    await alert.present();
  }
}
