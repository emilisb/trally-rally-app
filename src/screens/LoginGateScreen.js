import React from 'react';
import {setGuestRoot, setLoggedInRoot} from '../navigation';

export default function loginGateScreen(serverApi) {
  return class LoginGateScreen extends React.PureComponent {
    componentDidMount() {
      // TOOD: add login check logic here
      const isLoggedIn = false;

      if (isLoggedIn) {
        setLoggedInRoot();
      } else {
        setGuestRoot();
      }
    }

    render() {
      return null;
    }
  };
}
