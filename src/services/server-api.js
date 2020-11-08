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

  async login(code) {
    const CORRECT_CODE = '123456';
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === CORRECT_CODE) {
          resolve({success: true, token: 'my-auth-token'});
        } else {
          resolve({success: false});
        }
      }, 500);
    });
  }

  async fetchQuestions() {
    const data = [
      {
        id: 1,
        title: 'Šiaurės žvaigždė',
        image: 'https://i.ytimg.com/vi/6mQkb8nweEw/maxresdefault.jpg',
        type: 'photo',
        question:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used before final copy is available, but it may also be used to temporarily replace copy in a process called greeking, which allows designers to consider form without the meaning of the text influencing the design.',
        points: 1,
        submitted: false,
        locked: false,
      },
      {
        id: 2,
        title: 'Mieliausias šuo',
        image: 'https://i.ytimg.com/vi/6mQkb8nweEw/maxresdefault.jpg',
        type: 'input',
        question:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used before final copy is available, but it may also be used to temporarily replace copy in a process called greeking, which allows designers to consider form without the meaning of the text influencing the design.',
        points: 2,
        submitted: true,
        locked: false,
      },
      {
        id: 3,
        title: 'Surask Mane',
        image: 'https://i.ytimg.com/vi/6mQkb8nweEw/maxresdefault.jpg',
        type: 'qr',
        question:
          'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used before final copy is available, but it may also be used to temporarily replace copy in a process called greeking, which allows designers to consider form without the meaning of the text influencing the design.',
        points: 4,
        submitted: false,
        locked: false,
      },
    ];

    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(data);
      }, 500),
    );
  }
}
