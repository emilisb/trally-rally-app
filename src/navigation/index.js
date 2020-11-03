import {Navigation} from 'react-native-navigation';
import {SCREENS} from './screens';
import {ServerApi} from '../services/server-api';

const singletons = lazySingletons({
  serverApi: () => new ServerApi(),
});

export const registerComponents = () => {
  Navigation.registerComponent(SCREENS.HOME, () => require('../screens/HomeScreen').default(singletons.serverApi()));
};

export const createNavigation = () => {
  Navigation.setDefaultOptions({
    topBar: {
      visible: false,
    },
  });

  Navigation.events().registerAppLaunchedListener(() => {
    const root = {
      stack: {
        children: [
          {
            component: {
              name: SCREENS.HOME,
            },
          },
        ],
      },
    };

    Navigation.setRoot({
      root,
    });
  });
};

function lazySingletons(objects) {
  const lazyObjects = {};
  const singletons = new Map();

  Object.keys(objects).forEach((name) => {
    lazyObjects[name] = function () {
      if (singletons.has(name)) {
        return singletons.get(name);
      }

      const newObject = objects[name]();
      singletons.set(name, newObject);

      return newObject;
    };
  });

  return lazyObjects;
}
