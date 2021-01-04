import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {phonecall} from 'react-native-communications';
import {Navigation} from 'react-native-navigation';
import {Button, View, Colors, Avatar, Text, ListItem} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import assets from '../../assets';
import {Divider} from '../components/Divider';
import {showSuccessToast} from '../components/Toast';
import {CONTACT_PHONE} from '../constants';
import {setGuestRoot} from '../navigation';
import {SCREENS} from '../navigation/screens';

export default function profileScreen({serverApi, store}) {
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
      const {user} = await serverApi.getProfile();
      store.setUser(user);
      this.setState({user, isLoading: false});
    };

    logout = () => {
      store.logoutUser();
      setGuestRoot();
    };

    onProfileChanged = (user) => {
      if (user) {
        this.setState({user});
        showSuccessToast('Profilis atnaujintas');
      }
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

    onPressEditProfile = () => {
      const {user} = this.state;
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: SCREENS.EDIT_PROFILE,
                passProps: {
                  profile: user,
                  onDone: this.onProfileChanged,
                },
              },
            },
          ],
        },
      });
    };

    render() {
      const {user, isLoading} = this.state;
      if (isLoading) {
        return null;
      }

      const {name, photo, startTime, startPosition, checkpointsFound, checkpointsTotal, penalty} = user;
      return (
        <View useSafeArea flex>
          <View centerH paddingT-10 paddingB-20 bg-primaryColor>
            <Avatar size={120} source={photo ? {uri: photo} : assets.avatar} />
            <Text center text70BO white marginT-10>
              #21 {name}
            </Text>
            <Button
              marginT-10
              color={Colors.primaryColor}
              backgroundColor="white"
              iconSource={Icon.getImageSourceSync('pencil', 25)}
              iconStyle={styles.editIcon}
              size="small"
              label="Redaguoti Profilį"
              onPress={this.onPressEditProfile}
            />
          </View>
          <View paddingH-page paddingV-20>
            <View marginB-8>
              <SectionTitle title="Mano Statistika" />
            </View>
            <StatsRow label="Startas" value={startTime} />
            <StatsRow label="Startinė pozicija" value={startPosition} />
            <StatsRow label="Surasta paslėptų patikros taškų" value={`${checkpointsFound}/${checkpointsTotal}`} />
            <StatsRow label="Nuobauda" value={penalty} />
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
  editIcon: {
    width: 18,
    height: 18,
  },
});
