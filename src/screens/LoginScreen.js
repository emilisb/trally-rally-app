import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {View, TextField, Spacings, Button, Colors, Text, TouchableOpacity} from 'react-native-ui-lib';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {phonecall} from 'react-native-communications';
import {showErrorToast} from '../components/Toast';
import {setLoggedInRoot} from '../navigation';
import {CONTACT_PHONE} from '../constants';

export default function loginScreen({serverApi, store}) {
  return class LoginScreen extends React.PureComponent {
    static options() {
      return {
        topBar: {
          title: {
            text: 'Prisijungti',
          },
        },
      };
    }

    state = {
      phone: '',
      password: '',
      isLoading: false,
    };

    onChangePhone = (phone) => this.setState({phone});

    onChangePassword = (password) => this.setState({password});

    onPressContact = () => {
      phonecall(CONTACT_PHONE, true);
    };

    onPressLogIn = async () => {
      const {phone, password, isLoading} = this.state;
      if (!phone || !password || isLoading) {
        return;
      }

      try {
        this.setState({isLoading: true});
        const {accessToken, user} = await serverApi.login(phone, password);
        serverApi.setAuthToken(accessToken);

        await store.setAuthToken(accessToken);
        await store.setUser(user);

        setLoggedInRoot();
      } catch (e) {
        console.log(e);
        // showErrorToast('Neteisingas prisijungimo kodas.');
        showErrorToast('Nenumatyta klaida, pamėginkite dar kartą.');
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    };

    render() {
      const {isLoading} = this.state;
      return (
        <View useSafeArea flex>
          <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} extraScrollHeight={20}>
            <TextField
              autoCapitalize="none"
              returnKeyType="done"
              placeholder="Tel. Numeris"
              onChangeText={this.onChangePhone}
            />
            <TextField
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              placeholder="Slaptažodis"
              onChangeText={this.onChangePassword}
              onSubmitEditing={this.onPressLogIn}
            />
            <Button
              animateLayout
              animateTo={'left'}
              label={!isLoading ? 'Prisijungti' : undefined}
              onPress={this.onPressLogIn}
              throttleTime={200}
              style={isLoading ? styles.loginButtonLoader : styles.loginButton}
            >
              {isLoading ? <ActivityIndicator animating color={Colors.white} size="small" /> : null}
            </Button>
            <TouchableOpacity onPress={this.onPressContact}>
              <Text text80 dark10 center marginT-20>
                Praradote prisijungimą?{' '}
                <Text text80BO dark10>
                  Susisiekite su mumis
                </Text>
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
    marginHorizontal: Spacings.page,
  },
  loginButton: {
    width: '100%',
    minHeight: 43,
  },
  loginButtonLoader: {
    height: 43,
    alignSelf: 'center',
  },
});
