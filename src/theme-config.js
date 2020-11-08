import {Colors, Typography, Spacings} from 'react-native-ui-lib';

export const registerTheme = () => {
  Colors.loadColors({
    primaryColor: '#2364AA',
    secondaryColor: '#81C3D7',
    textColor: '##221D23',
    errorColor: Colors.red30,
    successColor: Colors.green30,
    warnColor: '##FF963C',
  });

  Typography.loadTypographies({
    heading: {fontSize: 36, fontWeight: '600'},
    subheading: {fontSize: 28, fontWeight: '500'},
    body: {fontSize: 18, fontWeight: '400'},
  });

  Spacings.loadSpacings({
    page: 20,
    card: 12,
    gridGutter: 16,
  });
};
