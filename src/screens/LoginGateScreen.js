import React from 'react';
import {setGuestRoot, setLoggedInRoot} from '../navigation';

export default function loginGateScreen({serverApi, store}) {
  return class LoginGateScreen extends React.PureComponent {
    static options() {
      return {
        topBar: {
          visible: false,
        },
      };
    }

    componentDidMount() {
      this.checkLoginStatus();
    }

    checkLoginStatus = async () => {
      const isLoggedIn = await store.isLoggedIn();

      if (isLoggedIn) {
        const authToken = await store.getAuthToken();
        serverApi.setAuthToken(authToken);

        setLoggedInRoot();
      } else {
        setGuestRoot();
      }
    };

    render() {
      return null;
    }
  };
}
