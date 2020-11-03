import firebase from 'firebase';
import 'firebase/firestore';
import config from '../config';

export class ServerApi {
  firebaseDb = null;

  constructor() {
    firebase.initializeApp(config.FIREBASE_CONFIG);
    this.firebaseDb = firebase.firestore();
  }

  async fetchDogs() {
    const querySnapshot = await this.firebaseDb.collection('dogs').get();
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  }
}
