import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, TouchableOpacity, Colors, Image} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
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
      cameraType: RNCamera.Constants.Type.back,
      flashMode: RNCamera.Constants.FlashMode.off,
      mirrorMode: true,
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

  onPressChangeCameraType = () => {
    if (this.state.cameraType === RNCamera.Constants.Type.back) {
      this.setState({
        cameraType: RNCamera.Constants.Type.front,
        mirrorMode: true,
      });
    } else {
      this.setState({
        cameraType: RNCamera.Constants.Type.back,
        mirrorMode: false,
      });
    }
  };

  onPressToggleFlash = () => {
    this.setState(({flashMode: prevFlashMode}) => ({
      flashMode:
        prevFlashMode === RNCamera.Constants.FlashMode.off
          ? RNCamera.Constants.FlashMode.torch
          : RNCamera.Constants.FlashMode.off,
    }));
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

  renderTopButtons = () => (
    <View flex row top right marginT-20 marginR-40>
      <TouchableOpacity onPress={this.onPressChangeCameraType} marginR-40>
        <Image source={assets.swap} style={styles.swapCamera} />
      </TouchableOpacity>
      <TouchableOpacity onPress={this.onPressToggleFlash}>
        <Icon name="bolt" size={25} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );

  render() {
    const {mode} = this.props;
    const {cameraError, cameraType, flashMode, mirrorMode} = this.state;
    const isQrReaderMode = mode === MODES.barCode;
    return (
      <View flex>
        <RNCamera
          style={styles.camera}
          ref={this.setCameraRef}
          type={cameraType}
          mirrorImage={mirrorMode}
          onMountError={this.onCameraError}
          onBarCodeRead={isQrReaderMode ? this.onBarCodeRead : undefined}
          flashMode={flashMode}
        />
        {this.renderTopButtons()}
        {cameraError ? this.renderCameraError() : null}
        {isQrReaderMode ? this.renderQrReaderLabel() : this.renderShootButton()}
      </View>
    );
  }
}

const ShootButton = React.memo(({onPress}) => (
  <TouchableOpacity center onPress={onPress} hitSlop={{top: 40, left: 40, bottom: 40, right: 40}}>
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
  swapCamera: {
    width: 35,
    height: 25,
    tintColor: Colors.white,
  },
});
