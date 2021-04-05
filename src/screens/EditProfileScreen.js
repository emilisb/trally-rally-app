import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Avatar, Colors, TextField, Button, TouchableOpacity, Spacings} from 'react-native-ui-lib';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Navigation} from 'react-native-navigation';
import assets from '../../assets';
import {SCREENS} from '../navigation/screens';
import {getStaticUrl} from '../helpers/url';

const SAVE_BUTTON_ID = 'save';
const DISMISS_BUTTON_ID = 'dismiss';

export default function editProfileScreen({serverApi, store}) {
  return class EditProfileScreen extends React.PureComponent {
    static options() {
      return {
        topBar: {
          title: {
            text: 'Redaguoti Profilį',
          },
          leftButtonColor: Colors.white,
          leftButtons: {
            id: DISMISS_BUTTON_ID,
            icon: assets.x,
          },
          rightButtons: [
            {
              id: SAVE_BUTTON_ID,
              text: 'Išsaugoti',
            },
          ],
        },
      };
    }

    constructor(props) {
      super(props);
      this.state = {
        name: props.profile.name,
        phone: props.profile.phone,
        photoUri: getStaticUrl(props.profile.avatar),
        photoData: null,
      };

      Navigation.events().bindComponent(this);
    }

    dismissModal = () => Navigation.dismissModal(this.props.componentId);

    navigationButtonPressed({buttonId}) {
      if (buttonId === DISMISS_BUTTON_ID) {
        this.dismissModal();
      } else if (buttonId === SAVE_BUTTON_ID) {
        this.save();
      }
    }

    save = async () => {
      const {name, phone, photoUri, photoData} = this.state;
      const updatedProfile = {
        ...this.props.profile,
        name,
        phone,
        photo: photoUri,
      };

      await serverApi.updateProfile({name, phone, photoData});
      store.setUser(updatedProfile);

      if (this.props.onDone) {
        this.props.onDone(updatedProfile);
      }

      this.dismissModal();
    };

    onPressChangePhoto = () => {
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

    onChangeName = (name) => this.setState({name});

    onChangePhone = (phone) => this.setState({phone});

    onPhotoTaken = (data) => {
      this.setState({photoUri: data.uri, photoData: data.base64});
    };

    render() {
      const {name, photoUri, phone} = this.state;
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} extraScrollHeight={20}>
          <View marginT-30 marginB-20 centerH>
            <TouchableOpacity onPress={this.onPressChangePhoto}>
              <Avatar size={120} source={photoUri ? {uri: photoUri} : assets.avatar} />
              <Button
                round
                iconSource={Icon.getImageSourceSync('camera', 25)}
                iconStyle={styles.editIcon}
                size="large"
                style={styles.editButton}
                onPress={this.onPressChangePhoto}
              />
            </TouchableOpacity>
          </View>
          <TextField
            floatingPlaceholder
            floatOnFocus
            showCharacterCounter
            maxLength={60}
            value={name}
            placeholder="Komandos Vardas"
            onChangeText={this.onChangeName}
          />
          <TextField
            floatingPlaceholder
            floatOnFocus
            keyboardType="phone-pad"
            value={phone}
            onChangeText={this.onChangePhone}
            placeholder="Telefono Nr."
          />
        </KeyboardAwareScrollView>
      );
    }
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacings.page,
  },
  editIcon: {
    width: 18,
    height: 18,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
