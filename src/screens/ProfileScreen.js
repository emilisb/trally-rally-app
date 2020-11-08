import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {Button, View, Colors, Shadows, Avatar, Text} from 'react-native-ui-lib';
import assets from '../../assets';
import {setGuestRoot} from '../navigation';

export default function profileScreen({store}) {
  return class ProfileScreen extends React.PureComponent {
    static options() {
      return {
        topBar: {
          noBorder: true,
          title: {
            text: 'Mano Profilis',
          },
        },
      };
    }

    state = {
      isLoading: true,
      user: {},
    };

    componentDidMount() {
      this.loadUser();
    }

    loadUser = async () => {
      const user = await store.getUser();
      this.setState({user, isLoading: false});
    };

    logout = () => {
      store.logoutUser();
      setGuestRoot();
    };

    onPressLogout = () => {
      Alert.alert('Atsijungimas', 'Ar tikrai norite atsijungti?', [
        {
          text: 'Ne',
          style: 'cancel',
        },
        {
          text: 'Taip',
          style: 'destructive',
          onPress: this.logout,
        },
      ]);
    };

    render() {
      if (this.state.isLoading) {
        return null;
      }

      const {user} = this.state;
      return (
        <View useSafeArea flex>
          <View centerH paddingT-10 paddingB-30 bg-primaryColor>
            <Avatar size={120} source={assets.avatar} />
            <Text center text70BO white marginT-8>
              {user.name}
            </Text>
          </View>
          <View flex bottom>
            <Button
              text70BO
              outline
              outlineWidth={1}
              outlineColor={Colors.grey70}
              fullWidth
              enableShadow
              label="Atsijungti"
              color={Colors.red30}
              backgroundColor={Colors.white}
              style={styles.logoutButton}
              onPress={this.onPressLogout}
            />
          </View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  logoutButton: {
    height: 48,
  },
});
