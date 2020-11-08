import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {phonecall} from 'react-native-communications';
import {Button, View, Colors, Avatar, Text, ListItem} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import assets from '../../assets';
import {Divider} from '../components/Divider';
import {CONTACT_PHONE} from '../constants';
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

    onPressCall = () => {
      phonecall(CONTACT_PHONE, true);
    };

    render() {
      if (this.state.isLoading) {
        return null;
      }

      const {user} = this.state;
      return (
        <View useSafeArea flex>
          <View centerH paddingT-10 paddingB-20 bg-primaryColor>
            <Avatar size={120} source={assets.avatar} />
            <Text center text70BO white marginT-20>
              #21 {user.name}
            </Text>
          </View>
          <View paddingH-page paddingV-20>
            <View marginB-8>
              <SectionTitle title="Mano Statistika" />
            </View>
            <StatsRow label="Startas" value="12:53:05" />
            <StatsRow label="Startinė pozicija" value="21" />
            <StatsRow label="Surasta paslėptų patikros taškų" value="1/5" />
            <StatsRow label="Nuobauda" value="00:00:40" />
          </View>
          <Divider />
          <View paddingH-page paddingV-20>
            <SectionTitle title="Pagalba" />
            <ListItem activeBackgroundColor={Colors.dark60} activeOpacity={0.3} onPress={this.onPressCall}>
              <ListItem.Part left>
                <Icon name="phone" size={20} />
              </ListItem.Part>
              <ListItem.Part middle marginL-20 column>
                <Text text70>Susisiekti</Text>
              </ListItem.Part>
              <ListItem.Part right>
                <Icon name="chevron-right" size={15} />
              </ListItem.Part>
            </ListItem>
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

const SectionTitle = ({title}) => <Text text60>{title}</Text>;

const StatsRow = ({label, value}) => (
  <View row spread marginT-4>
    <Text text70>{label}</Text>
    <Text text70>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  logoutButton: {
    height: 48,
  },
});
