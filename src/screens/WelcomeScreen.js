import React from 'react';
import {StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {View, Button, Image, Colors} from 'react-native-ui-lib';
import Video from 'react-native-video';
import assets from '../../assets';
import {SCREENS} from '../navigation/screens';

export default function welcomeScreen() {
  return class WelcomeScreen extends React.PureComponent {
    static options() {
      return {
        topBar: {
          visible: false,
        },
      };
    }

    onPressLogin = () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: SCREENS.LOGIN,
        },
      });
    };

    render() {
      return (
        <View useSafeArea flex>
          <Video
            source={assets.loginVideo}
            style={styles.backgroundVideo}
            muted={true}
            repeat={true}
            resizeMode={'cover'}
            rate={1.0}
            ignoreSilentSwitch={'obey'}
          />
          <View centerH marginT-250 paddingH-page>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View flex bottom marginB-150>
            <Button marginH-page label="Prisijungti" onPress={this.onPressLogin} />
          </View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
    opacity: 0.15,
  },
  logo: {
    tintColor: Colors.primaryColor,
    width: '100%',
  },
});
