import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Text, Image, FlatList, StyleSheet} from 'react-native';

import firebase from 'firebase';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyDvvSP7WsJpQ6FbfLBXGPwHZu_IKRA_kbI',
  authDomain: 'trallyrally.firebaseapp.com',
  databaseURL: 'https://trallyrally.firebaseio.com',
  projectId: 'trallyrally',
  storageBucket: 'trallyrally.appspot.com',
  messagingSenderId: '58094989239',
  appId: '1:58094989239:web:11a2cfad553108d7c5c232',
});

const db = firebase.firestore();

const App = () => {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    db.collection('dogs')
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDogs(data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <>
        <Text>{item.name}</Text>
        <Image source={{uri: item.image}} style={styles.image} />
      </>
    ),
    [],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={dogs} renderItem={renderItem} keyExtractor={keyExtractor} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 200,
    width: 200,
  },
});

export default App;
