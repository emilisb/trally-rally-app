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
import {QuestionType} from '../constants';
import {getStaticUrl} from '../helpers/url';

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
      this.state = {
        photoUri: props.item.type === QuestionType.PHOTO ? getStaticUrl(props.item.lastAnswer) : null,
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

    onChangeText = (answer) => this.setState({answer});

    onPressSave = async () => {
      try {
        const {answer, photoUri} = this.state;
        const {item, componentId, onDone} = this.props;
        const response = await serverApi.submitAnswer(item.id, answer);

        if (response && response.success) {
          if (onDone) {
            const lastAnswer = item.type === QuestionType.PHOTO ? getStaticUrl(photoUri) : answer;
            onDone({...item, lastAnswer, submitted: true});
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
    };

    onBarCodeRead = (answer) => {
      this.setState({answer}, this.onPressSave);
    };

    onPressTakePhoto = () => {
      Navigation.showModal({
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

    onPressScanQr = () => {
      Navigation.showModal({
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
        case QuestionType.INPUT:
          return this.renderInputField();
        case QuestionType.PHOTO:
          return this.renderTakePhotoButton();
        case QuestionType.QR:
          return this.renderScanQrButton();
      }
    }

    render() {
      const {photoUri, photoId} = this.state;
      const {item} = this.props;
      const width = Dimensions.get('window').width - 40;
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} extraScrollHeight={20}>
          {item.image ? (
            <ScaledImage
              uri={getStaticUrl(item.image)}
              width={width}
              customStyle={styles.image}
              imageProps={{nativeID: `image${item.id}Dest`}}
            />
          ) : null}
          <Text text50 marginT-12 nativeID="title">
            {item.title}
          </Text>
          <Text text80 nativeID="description">
            {item.text}
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
