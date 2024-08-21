import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuerySnapshot } from '@angular/fire/compat/firestore';




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

  addToCollection(collectionPath: string, data: any): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único para el documento
    return this.firestore.collection(collectionPath).doc(id).set(data); // Añade el documento con el ID generado
  }

  generateDocId(collectionPath: string): string {
    return this.firestore.collection(collectionPath).doc().ref.id;
  }

  setCollection(path: string, data: any) {
    return this.firestore.collection(path).add(data);
  }

  setCollectionlife(collectionPath: string, data: any, docId: string) {
    return this.firestore.collection(collectionPath).doc(docId).set(data);
  }
 

  setcollecion(path: string, data: any) { 
    return addDoc(collection(getFirestore(), path), data);
  }
  getCollectionlife(path: string, collectionQuery?: any): Observable<any[]> {
    return this.firestore.collection(path, collectionQuery).valueChanges();
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


  updateDocument(path: string, documentId: string, data: any) {
    return this.firestore.collection(path).doc(documentId).update(data);
  }

 
  async getHistorycicle(rack: string): Promise<any[]> {
    try {
      const historySnapshot = await this.firestore.collection('historycicle', ref => ref.where('rack', '==', rack)).get().toPromise();

      if (historySnapshot && !historySnapshot.empty) {
        return historySnapshot.docs.map(doc => doc.data());
      } else {
        return []; // Devuelve un array vacío si no hay documentos
      }
    } catch (error) {
      console.error("Error fetching historycicle: ", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  // Otros métodos de tu servicio Firebase...
}
 



