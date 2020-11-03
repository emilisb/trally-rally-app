import {Navigation} from 'react-native-navigation';
import {SCREENS} from './screens';
import {ServerApi} from '../services/server-api';

const singletons = lazySingletons({
  serverApi: () => new ServerApi(),
});

Navigation.registerComponent(SCREENS.HOME, () => require('../screens/HomeScreen').default(singletons.serverApi()));

Navigation.setDefaultOptions({
  topBar: {
    visible: false,
  },
});

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: SCREENS.HOME,
            },
          },
        ],
      },
    },
  });
});

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
