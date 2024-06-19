import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  
  constructor(
    public firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  
  setCollectionWithId(path: string, id: string, data: any) {
    return this.firestore.collection(path).doc(id).set(data);
  }

  setCollection(path: string, data: any) {
    return this.firestore.collection(path).add(data);
  }

  setcollecion(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  getCollection(path: string, collectionQuery?: any) {
    return this.firestore.collection(path, collectionQuery).valueChanges();
  }

  getCollectionByEmail(path: string, email: string) {
    return this.firestore.collection(path, ref => ref.where('correoElectronico', '==', email)).valueChanges();
  }

  update(path: string, data: any) {
    return this.firestore.doc(path).update(data);
  }

  getCollectionByEmailAndPassword(path: string, email: string, password: string) {
    return this.firestore.collection(path, ref => ref.where('correoElectronico', '==', email).where('contraseña', '==', password)).valueChanges();
  }

  getCollectionOneObject(path: string, key: string, atributoSearch: string) {
    return this.firestore.collection(path, ref => ref.where(atributoSearch, '==', key)).valueChanges();
  }

  deleteDocument(path: string, documentId: string) {
    return this.firestore.doc(`${path}/${documentId}`).delete();
  }
  getCollectionByClockNumberAndPassword(path: string, clockNumber: string, password: string) {
    return this.firestore.collection(path, ref => ref
      .where('clockNumber', '==', clockNumber)
      .where('password', '==', password))
      .valueChanges();
  }
 
// FirebaseService
setHistory(path: string, data: any) {
  return this.firestore.collection(path).add(data);
}


// FirebaseService
currentUser: any;
}

