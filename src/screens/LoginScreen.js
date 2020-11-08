import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {View, TextField, Spacings, Button, Colors} from 'react-native-ui-lib';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showErrorToast} from '../components/Toast';
import {setLoggedInRoot} from '../navigation';

export default function loginScreen(serverApi) {
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

    onPressLogIn = async () => {
      const {code, isLoading} = this.state;
      if (!code || isLoading) {
        return;
      }

      try {
        this.setState({isLoading: true});
        const {success} = await serverApi.login(code);
        if (success) {
          setLoggedInRoot();
        } else {
          showErrorToast('Neteisingas prisijungimo kodas.');
        }
      } catch (e) {
        console.warn(e);
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
