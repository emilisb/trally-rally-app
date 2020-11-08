import {Navigation} from 'react-native-navigation';
import {Colors} from 'react-native-ui-lib';
import {SCREENS} from '../../navigation/screens';

export class ToastHandler {
  hideTimeout = null;
  componentId = null;

  constructor() {
    Navigation.events().registerCommandListener((name, {componentId}) => {
      if (this.componentId && componentId !== this.componentId) {
        this.hideToast();
      }
    });

    Navigation.events().registerBottomTabSelectedListener(() => {
      if (this.componentId) {
        this.hideToast();
      }
    });
  }

  showToast = async (message, options = {}) => {
    if (this.componentId) {
      this.hideToast();
    }

    const timeout = options.timeout || 2000;
    const backgroundColor = options.backgroundColor || Colors.primaryColor;

    this.componentId = await Navigation.showOverlay({
      component: {
        name: SCREENS.TOAST_OVERLAY,
        passProps: {
          ...options,
          message,
          timeout,
          backgroundColor,
          bottomMargin: true,
        },
        options: {
          layout: {
            backgroundColor: 'transparent',
            componentBackgroundColor: 'transparent',
          },
          overlay: {
            interceptTouchOutside: false,
          },
        },
      },
    });

    this.hideTimeout = setTimeout(this.hideToast, timeout + 400);
  };

  hideToast = () => {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    if (this.componentId) {
      Navigation.dismissOverlay(this.componentId);
    }
    this.componentId = null;
  };
}
