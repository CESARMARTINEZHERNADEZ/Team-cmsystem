import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




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
  getCollectionlend(collectionName: string) {
    return this.firestore.collection(collectionName).valueChanges({ idField: 'Id' });
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

  deleteDocumentlend(collectionName: string, docId: string) {
    console.log(`Deleting document ${docId} from collection ${collectionName}`);
    return this.firestore.collection(collectionName).doc(docId).delete();
  }

 

  getCollectionByClockNumberAndPassword(path: string, clockNumber: string, password: string) {
    return this.firestore.collection(path, ref => ref
      .where('clockNumber', '==', clockNumber)
      .where('password', '==', password))
      .valueChanges();
  }

  setHistory(path: string, data: any) {
    return this.firestore.collection(path).add(data);
  }


  getCollectionData(collection: string) {
    return this.firestore.collection(collection).valueChanges();
  }
  getDocument(path: string, documentId: string) {
    return this.firestore.doc(`${path}/${documentId}`).get();
  }
  getDocument2(collectionName: string, documentId: string): Promise<any> {
    return this.firestore.collection(collectionName).doc(documentId).get().toPromise();
  }
 
  getDocument1(collection: string, documentId: string) {
    return this.firestore.collection(collection).doc(documentId).get();
  }
  
  update1(path: string, data: any) {
    return this.firestore.doc(path).update(data);
  }




  
  createCollection(collectionName: string) {
    return this.firestore.collection(collectionName).add({});
  }

  saveCollections(collections: string[]) {
    return this.firestore.collection('savedCollections').doc('collectionsList').set({ collections });
  }

  getCollections(): Observable<string[]> {
    return this.firestore
      .collection('savedCollections')
      .doc<{ collections: string[] }>('collectionsList')
      .valueChanges()
      .pipe(
        map((doc) => {
          return doc?.collections || [];
        })
      );
  }

  addConsumableToCollection(collectionName: string, consumable: any) {
    return this.firestore.collection(collectionName).add(consumable);
  }


 // Método para actualizar un documento
 updateDocument(collectionName: string, documentId: string, data: any): Promise<void> {
  return this.firestore.collection(collectionName).doc(documentId).update(data)
    .then(() => {
      console.log(`Document ${documentId} in ${collectionName} updated successfully!`);
    })
    .catch((error) => {
      console.error(`Error updating document ${documentId} in ${collectionName}:`, error);
      throw error; // Re-throw the error if you want to handle it outside the function
    });
}


}


