const singletons = lazySingletons({
  serverApi: () => new (require('../services/server-api').ServerApi)(),
  store: () => new (require('../store').GlobalStore)(),
});

export const registerComponents = () => {
  const {Navigation} = require('react-native-navigation');
  const {SCREENS} = require('./screens');
  Navigation.registerComponent(SCREENS.HOME, () => require('../screens/HomeScreen').default(singletons.serverApi()));
  Navigation.registerComponent(SCREENS.QUESTION, () =>
    require('../screens/QuestionScreen').default(singletons.serverApi()),
  );
  Navigation.registerComponent(SCREENS.PROFILE, () =>
    require('../screens/ProfileScreen').default({store: singletons.store()}),
  );
  Navigation.registerComponent(SCREENS.LOGIN, () =>
    require('../screens/LoginScreen').default({
      serverApi: singletons.serverApi(),
      store: singletons.store(),
    }),
  );
  Navigation.registerComponent(SCREENS.WELCOME, () => require('../screens/WelcomeScreen').default());
  Navigation.registerComponent(SCREENS.LOGIN_GATE, () =>
    require('../screens/LoginGateScreen').default({
      serverApi: singletons.serverApi(),
      store: singletons.store(),
    }),
  );
  Navigation.registerComponent(SCREENS.CAMERA, () => require('../screens/CameraScreen').default);
  Navigation.registerComponent(SCREENS.TOAST_OVERLAY, () => require('../components/Toast/component').default);
};

export const createNavigation = () => {
  const {Navigation} = require('react-native-navigation');
  const {Colors} = require('react-native-ui-lib');
  Navigation.setDefaultOptions({
    topBar: {
      title: {
        color: Colors.white,
        fontWeight: 'bold',
      },
      background: {
        color: Colors.primaryColor,
      },
      backButton: {
        color: Colors.white,
      },
      rightButtonColor: Colors.white,
    },
    bottomTab: {
      selectedIconColor: Colors.primaryColor,
      selectedTextColor: Colors.primaryColor,
    },
    statusBar: {
      style: 'light',
    },
    layout: {
      backgroundColor: Colors.white,
      componentBackgroundColor: Colors.white,
    },
  });

  Navigation.events().registerAppLaunchedListener(() => {
    setInitialRoot();
  });
};

const setInitialRoot = () => {
  const {Navigation} = require('react-native-navigation');
  const {SCREENS} = require('./screens');
  const root = {
    stack: {
      children: [
        {
          component: {
            name: SCREENS.LOGIN_GATE,
          },
        },
      ],
    },
  };

  Navigation.setRoot({
    root,
  });
};

export const setGuestRoot = () => {
  const {Navigation} = require('react-native-navigation');
  const {SCREENS} = require('./screens');
  const root = {
    stack: {
      children: [
        {
          component: {
            name: SCREENS.WELCOME,
          },
        },
      ],
    },
  };

  Navigation.setRoot({
    root,
  });
};

export const setLoggedInRoot = () => {
  const {Navigation} = require('react-native-navigation');
  const Icon = require('react-native-vector-icons/FontAwesome');
  const {SCREENS} = require('./screens');
  const root = {
    bottomTabs: {
      id: 'BOTTOM_TABS_LAYOUT',
      children: [
        {
          stack: {
            id: 'HOME_TAB',
            children: [
              {
                component: {
                  id: 'HOME_SCREEN',
                  name: SCREENS.HOME,
                },
              },
            ],
            options: {
              bottomTab: {
                icon: Icon.getImageSourceSync('question-circle', 25),
                text: 'Klausimai',
              },
            },
          },
        },
        {
          stack: {
            id: 'PROFILE_TAB',
            children: [
              {
                component: {
                  id: 'PROFILE_SCREEN',
                  name: SCREENS.PROFILE,
                },
              },
            ],
            options: {
              bottomTab: {
                icon: Icon.getImageSourceSync('user-circle', 25),
                text: 'Profilis',
              },
            },
          },
        },
      ],
    },
  };

  Navigation.setRoot({
    root,
  });
};

function lazySingletons(objects) {
  const lazyObjects = {};
  const instances = new Map();

  Object.keys(objects).forEach((name) => {
    lazyObjects[name] = function () {
      if (instances.has(name)) {
        return instances.get(name);
      }

      const newObject = objects[name]();
      instances.set(name, newObject);

      return newObject;
    };
  });

  return lazyObjects;
}
