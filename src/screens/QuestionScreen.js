import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {View, Image, BorderRadiuses, Text} from 'react-native-ui-lib';
import ScaledImage from '../components/ScaledImage';

export default function questionScreen(serverApi) {
  return class QuestionScreen extends React.PureComponent {
    render() {
      const {item} = this.props;
      const width = Dimensions.get('window').width - 40;
      return (
        <View useSafeArea marginT-20 marginH-20>
          {/* <Image source={{uri: item.image}} style={{width: 200, height: 200}} nativeID={`image${item.id}Dest`} /> */}
          <ScaledImage
            uri={item.image}
            width={width}
            customStyle={styles.image}
            imageProps={{nativeID: `image${item.id}Dest`}}
          />
          <Text text50 marginT-12 nativeID="title">
            {item.title}
          </Text>
          <Text text80 nativeID="description">
            {item.question}
          </Text>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  image: {
    borderRadius: BorderRadiuses.br20,
  },
});
