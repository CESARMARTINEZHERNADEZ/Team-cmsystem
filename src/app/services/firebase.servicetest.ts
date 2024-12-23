import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { map } from 'rxjs/operators'; // Importar map desde rxjs/operators



@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  constructor(
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    
  ) { }



  updateConsumableSubTotal(consumableId: string, newSubTotal: number): Promise<void> {
    return this.firestore.collection('consumables').doc(consumableId).update({
      SubTotal: newSubTotal
    });
  }
  
  // Actualizar el Lend de un consumible
  updateConsumableLend(consumableId: string, newLend: number): Promise<void> {
    return this.firestore.collection('consumables').doc(consumableId).update({
      lend: newLend
    });
  }




  getCollectionWhere(collection: string, field: string, operator: firebase.firestore.WhereFilterOp, value: any): Promise<firebase.firestore.QuerySnapshot> {
    return firebase.firestore().collection(collection).where(field, operator, value).get();
}
deleteFromCollection(collection: string, docId: string): Promise<void> {
  return this.firestore.collection(collection).doc(docId).delete();
}


getToolslendCollection() {
  return this.firestore.collection('toolslend').valueChanges();
}


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



  async deleteDocumentlend(collectionName: string, documentId: string): Promise<void> {
    try {
      const docRef = this.firestore.collection(collectionName).doc(documentId);
      await docRef.delete();
      console.log(`Document ${documentId} deleted from collection ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting document ${documentId} from collection ${collectionName}:`, error);
      throw error;
    }
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
  
  async getLocations(): Promise<any[]> {
    try {
      const snapshot = await this.firestore.collection('locations').get().toPromise();
  
      // Verificamos si snapshot no es undefined
      if (snapshot && !snapshot.empty) {
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } else {
        return []; // Devuelve un array vacío si no hay documentos o si snapshot es undefined
      }
    } catch (error) {
      console.error("Error fetching locations: ", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async getLocationstools(): Promise<any[]> {
    try {
      const snapshot = await this.firestore.collection('toolslocation').get().toPromise();
  
      // Verificamos si snapshot no es undefined
      if (snapshot && !snapshot.empty) {
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } else {
        return []; // Devuelve un array vacío si no hay documentos o si snapshot es undefined
      }
    } catch (error) {
      console.error("Error fetching locations: ", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async getLocationgeneral(): Promise<any[]> {
    try {
      const snapshot = await this.firestore.collection('generallocation').get().toPromise();
  
      // Verificamos si snapshot no es undefined
      if (snapshot && !snapshot.empty) {
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } else {
        return []; // Devuelve un array vacío si no hay documentos o si snapshot es undefined
      }
    } catch (error) {
      console.error("Error fetching locations: ", error);
      return []; // Devuelve un array vacío en caso de error
    }
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

}

 



