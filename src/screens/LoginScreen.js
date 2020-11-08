import React from 'react';
import {StyleSheet} from 'react-native';
import {View, TextField, Spacings, Button} from 'react-native-ui-lib';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showErrorToast} from '../components/Toast';
import {setLoggedInRoot} from '../navigation';

export default function loginScreen(serverApi) {
  return class LoginScreen extends React.PureComponent {
    state = {
      code: '',
    };

    onChangeCode = (code) => this.setState({code});

    onPressLogIn = async () => {
      const {code} = this.state;
      if (!code) {
        return;
      }

      try {
        const {success} = await serverApi.login(code);
        if (success) {
          setLoggedInRoot();
        } else {
          showErrorToast('Neteisingas prisijungimo kodas.');
        }
      } catch (e) {
        console.warn(e);
        showErrorToast('Nenumatyta klaida, pamėginkite dar kartą.');
      }
    };

    render() {
      return (
        <View useSafeArea flex>
          <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} extraScrollHeight={20}>
            <TextField
              floatingPlaceholder
              floatOnFocus
              autoCapitalize="none"
              returnKeyType="done"
              placeholder="Prisijungimo kodas"
              onChangeText={this.onChangeCode}
              onSubmitEditing={this.onPressLogIn}
            />
            <Button label="Prisijungti" onPress={this.onPressLogIn} throttleTime={200} />
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
});
