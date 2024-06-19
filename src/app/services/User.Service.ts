import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any = null; // Definir la propiedad user
  private userKey = 'user'; // Clave para el almacenamiento en localStorage

  setUser(user: any) {
    this.user = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const storedUser = localStorage.getItem(this.userKey);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null; // Si no hay usuario almacenado, devuelve null
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem(this.userKey);
  }
}
