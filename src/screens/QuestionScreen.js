import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {View, BorderRadiuses, Text, TextField, Button, Spacings} from 'react-native-ui-lib';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Entypo';
import ScaledImage from '../components/ScaledImage';
import {showErrorToast, showSuccessToast} from '../components/Toast';
import {SCREENS} from '../navigation/screens';
import {MODES} from './CameraScreen';

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

    cameraComponentId = null;

    constructor(props) {
      super(props);
      this.state = {
        photoUri: props.item.type === 'photo' ? props.item.lastAnswer : null,
        answer: props.item.lastAnswer,
        photoId: 0, // Used for refreshing the image preview after retaking a photo
      };
      Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}) {
      if (buttonId === 'save') {
        this.onPressSave();
      }
    }

    dismissCamera = () => {
      if (this.cameraComponentId) {
        Navigation.dismissModal(this.cameraComponentId);
        this.cameraComponentId = null;
      }
    };

    onChangeText = (answer) => this.setState({answer});

    onPressSave = async () => {
      try {
        const {answer} = this.state;
        const {item, componentId, onDone} = this.props;
        const response = await serverApi.submitAnswer(item.id, answer);

        if (response && response.success) {
          if (onDone) {
            onDone(response.question);
          }

          Navigation.pop(componentId);
          showSuccessToast('Atsakymas pateiktas');
        } else {
          throw new Error('Unable to save answer');
        }
      } catch (e) {
        showErrorToast('Serverio klaida. Pabandykite dar kartą.');
      }
    };

    onPhotoTaken = (data) => {
      this.setState(({photoId}) => ({photoUri: data.uri, answer: data.base64, photoId: photoId + 1}));
      this.dismissCamera();
    };

    onBarCodeRead = (answer) => {
      this.dismissCamera();
      this.setState({answer}, () => {
        this.onPressSave();
      });
    };

    onPressTakePhoto = async () => {
      this.cameraComponentId = await Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: SCREENS.CAMERA,
                passProps: {
                  onPhotoTaken: this.onPhotoTaken,
                },
              },
            },
          ],
        },
      });
    };

    onPressScanQr = async () => {
      this.cameraComponentId = await Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: SCREENS.CAMERA,
                passProps: {
                  mode: MODES.barCode,
                  onBarCodeRead: this.onBarCodeRead,
                },
              },
            },
          ],
        },
      });
    };

    renderTakePhotoButton() {
      const {photoUri} = this.state;
      return (
        <View marginT-12>
          <Button
            label={photoUri ? 'Pakeisti nuotrauką' : 'Pateikti nuotrauką'}
            iconSource={Icon.getImageSourceSync('camera', 24)}
            iconStyle={styles.photoIcon}
            onPress={this.onPressTakePhoto}
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
            onPress={this.onPressScanQr}
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
            onChangeText={this.onChangeText}
            value={this.state.answer}
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
      const {photoUri, photoId} = this.state;
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
          {photoUri ? (
            <View marginT-20 key={photoId}>
              <ScaledImage uri={photoUri} width={width} customStyle={styles.image} />
            </View>
          ) : null}
        </KeyboardAwareScrollView>
      );
    }
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: Spacings.page,
  },
  image: {
    borderRadius: BorderRadiuses.br20,
  },
  photoIcon: {
    width: 24,
    height: 24,
  },
});
