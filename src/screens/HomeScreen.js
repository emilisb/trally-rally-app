import React from 'react';
import {SafeAreaView, Text, Image, FlatList, StyleSheet} from 'react-native';

export default function homeScreen(serverApi) {
  return class homeScreen extends React.PureComponent {
    state = {
      dogs: [],
    };

    componentDidMount() {
      this.loadData();
    }

    async loadData() {
      const dogs = await serverApi.fetchDogs();
      this.setState({dogs});
    }

    renderItem = ({item}) => (
      <>
        <Text>{item.name}</Text>
        <Image source={{uri: item.image}} style={styles.image} />
      </>
    );

    keyExtractor = (item) => item.id;

    render() {
      return (
        <SafeAreaView style={styles.container}>
          <FlatList data={this.state.dogs} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />
        </SafeAreaView>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 200,
    width: 200,
  },
});
