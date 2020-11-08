import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from 'react-native-ui-lib';

export const Divider = () => <View style={styles.item} />;

const styles = StyleSheet.create({
  item: {
    height: 10,
    backgroundColor: Colors.grey70,
  },
});
