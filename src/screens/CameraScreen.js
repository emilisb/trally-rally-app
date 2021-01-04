import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, TouchableOpacity, Colors} from 'react-native-ui-lib';
import {RNCamera} from 'react-native-camera';
import assets from '../../assets';
import {Navigation} from 'react-native-navigation';
import config from '../config';

export const MODES = {
  photo: 'photo',
  barCode: 'barcode',
};

export default class CameraScreen extends React.PureComponent {
  static options() {
    return {
      topBar: {
        leftButtonColor: Colors.white,
        leftButtons: {
          id: 'dismiss',
          icon: assets.x,
        },
      },
    };
  }

  camera = null;

  readingBarCode = true;

  constructor(props) {
    super(props);
    this.state = {
      cameraError: false,
    };

    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({buttonId}) {
    if (buttonId === 'dismiss') {
      this.dismissModal();
    }
  }

  dismissModal = () => Navigation.dismissModal(this.props.componentId);

  setCameraRef = (ref) => {
    this.camera = ref;
  };

  onPressShoot = async () => {
    if (this.camera) {
      this.camera.pausePreview();

      const options = {quality: 0.8, base64: true};
      const data = await this.camera.takePictureAsync(options);
      if (this.props.onPhotoTaken) {
        this.props.onPhotoTaken(data);
        this.dismissModal();
      }
    }
  };

  onCameraError = () => {
    this.setState({cameraError: true});
  };

  onBarCodeRead = (event) => {
    const {data} = event;
    if (this.readingBarCode && data.includes(config.QR_MAGIC_WORD)) {
      this.readingBarCode = false;
      this.camera.pausePreview();

      if (this.props.onBarCodeRead) {
        this.props.onBarCodeRead(data);
        this.dismissModal();
      }
    }
  };

  renderCameraError = () => (
    <View paddingH-page marginT-20>
      <Text white text70>
        Nepavyko atverti kameros. Įsitikinkite, kad davėte leidimą pasiekti kamerą.
      </Text>
    </View>
  );

  renderQrReaderLabel() {
    return (
      <Text white text70 center marginT-50>
        Nukreipkite kamerą į QR kodą.
      </Text>
    );
  }

  renderShootButton() {
    return (
      <View flex bottom centerH marginB-60>
        <ShootButton onPress={this.onPressShoot} />
      </View>
    );
  }

  render() {
    const {mode} = this.props;
    const {cameraError} = this.state;
    const isQrReaderMode = mode === MODES.barCode;
    return (
      <View flex>
        <RNCamera
          style={styles.camera}
          ref={this.setCameraRef}
          onMountError={this.onCameraError}
          onBarCodeRead={isQrReaderMode ? this.onBarCodeRead : undefined}
        />
        {cameraError ? this.renderCameraError() : null}
        {isQrReaderMode ? this.renderQrReaderLabel() : this.renderShootButton()}
      </View>
    );
  }
}

const ShootButton = React.memo(({onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.shootButtonOuter}>
      <View style={styles.shootButtonInner} />
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -10,
  },
  shootButtonOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shootButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.dark10,
  },
});
