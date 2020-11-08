import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {View, BorderRadiuses, Text, TextField, Button} from 'react-native-ui-lib';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Entypo';
import ScaledImage from '../components/ScaledImage';
import {showSuccessToast} from '../components/Toast';

export default function questionScreen(serverApi) {
  return class QuestionScreen extends React.PureComponent {
    static options() {
      return {
        topBar: {
          rightButtons: [
            {
              id: 'save',
              text: 'Išsaugoti',
            },
          ],
        },
      };
    }

    constructor(props) {
      super(props);
      Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}) {
      if (buttonId === 'save') {
        this.onPressSave();
      }
    }

    onPressSave() {
      Navigation.pop(this.props.componentId);
      showSuccessToast('Atsakymas pateiktas');
    }

    renderTakePhotoButton() {
      return (
        <View marginT-12>
          <Button
            label="Padaryti nuotrauką"
            iconSource={Icon.getImageSourceSync('camera', 24)}
            iconStyle={styles.photoIcon}
          />
        </View>
      );
    }

    renderScanQrButton() {
      return (
        <View marginT-12>
          <Button
            label="Nuskenuoti QR kodą"
            iconSource={Icon.getImageSourceSync('camera', 24)}
            iconStyle={styles.photoIcon}
          />
        </View>
      );
    }

    renderInputField() {
      return (
        <View marginT-12>
          <TextField
            floatingPlaceholder
            floatOnFocus
            showCharacterCounter
            placeholder="Įrašykite atsakymą"
            maxLength={60}
          />
        </View>
      );
    }

    renderAnswer() {
      const {item} = this.props;
      switch (item.type) {
        case 'input':
          return this.renderInputField();
        case 'photo':
          return this.renderTakePhotoButton();
        case 'qr':
          return this.renderScanQrButton();
      }
    }

    render() {
      const {item} = this.props;
      const width = Dimensions.get('window').width - 40;
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} extraScrollHeight={20}>
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
          {this.renderAnswer()}
        </KeyboardAwareScrollView>
      );
    }
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  image: {
    borderRadius: BorderRadiuses.br20,
  },
  photoIcon: {
    width: 24,
    height: 24,
  },
});
