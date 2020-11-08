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
      code: '',
      isLoading: false,
    };

    onChangeCode = (code) => this.setState({code});

    onPressContact = () => {
      phonecall(CONTACT_PHONE, true);
    };

    onPressLogIn = async () => {
      const {code, isLoading} = this.state;
      if (!code || isLoading) {
        return;
      }

      try {
        this.setState({isLoading: true});
        const {success, authToken, user} = await serverApi.login(code);
        if (success) {
          serverApi.setAuthToken(authToken);

          await store.setAuthToken(authToken);
          await store.setUser(user);

          setLoggedInRoot();
        } else {
          showErrorToast('Neteisingas prisijungimo kodas.');
        }
      } catch (e) {
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
              placeholder="Prisijungimo kodas"
              onChangeText={this.onChangeCode}
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
