import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {View, LoaderScreen} from 'react-native-ui-lib';
import Geolocation from '@react-native-community/geolocation';
import {SCREENS} from '../navigation/screens';
import {QuestionListItem} from '../components/QuestionListItem';
import {showErrorToast, showGenericToast} from '../components/Toast';

const MULTIPLIER = 1.2;
const POP_MULTIPLIER = 1.0;
const LONG_DURATION = 540 * MULTIPLIER;
const SHORT_DURATION = 210 * MULTIPLIER;

const SPRING_CONFIG = {mass: 2, damping: 500, stiffness: 200};

export default function homeScreen(serverApi) {
  return class HomeScreen extends React.PureComponent {
    positionWatchId = null;

    static options() {
      return {
        topBar: {
          title: {
            text: 'Klausimai',
          },
        },
      };
    }

    state = {
      questions: [],
      unlockedQuestion: null,
      isLoading: true,
      isRefreshing: false,
      lat: 0,
      long: 0,
    };

    componentDidMount() {
      this.loadData();
      this.setPositionWatcher();
    }

    componentWillUnmount() {
      if (this.positionWatchId) {
        Geolocation.clearWatch(this.positionWatchId);
        this.positionWatchId = null;
      }
    }

    setPositionWatcher = () => {
      this.positionWatchId = Geolocation.watchPosition(this.onPositionChange, this.onPositionError, {
        maximumAge: 0,
        enableHighAccuracy: true,
        distanceFilter: 5,
      });
    };

    loadData = async () => {
      const {lat, long, unlockedQuestion: prevUnlockedQuestion} = this.state;
      const questions = await serverApi.fetchQuestions({lat, long});
      const unlockedQuestion = questions.find((item) => !item.locked);
      this.setState({questions, unlockedQuestion: unlockedQuestion?.id, isLoading: false});

      const isNewUnlock = unlockedQuestion?.id !== prevUnlockedQuestion;
      if (unlockedQuestion && isNewUnlock) {
        this.onQuestionUnlocked(unlockedQuestion);
      }
    };

    onRefresh = async () => {
      this.setState({isRefreshing: true});
      await this.loadData();
      this.setState({isRefreshing: false});
    };

    onPositionChange = (info) => {
      if (info?.coords) {
        const {latitude, longitude} = info.coords;
        this.setState({lat: latitude, long: longitude}, this.loadData);
      }
    };

    onPositionError = ({code, message}) => {
      showErrorToast('Nepavyko aptikti Jūsų vietovės.');
      this.setState({lat: 0, long: 0}, this.loadData);
    };

    onQuestionUnlocked = (question) => {
      showGenericToast(`Klausimas "${question.title}" atrakintas.`);
    };

    onQuestionUpdate = (question) => {
      const questions = this.state.questions.map((item) => (item.id === question.id ? question : item));
      this.setState({questions});
    };

    onPressQuestion = (item, index) => {
      if (item.locked) {
        return;
      }

      Navigation.push(this.props.componentId, {
        component: {
          name: SCREENS.QUESTION,
          passProps: {
            item,
            onDone: this.onQuestionUpdate,
          },
          options: {
            topBar: {
              title: {
                text: `Klausimas #${index + 1}`,
              },
            },
            animations: {
              push: {
                content: {
                  alpha: {
                    from: 0,
                    to: 1,
                    duration: SHORT_DURATION,
                  },
                },
                sharedElementTransitions: [
                  {
                    fromId: `image${item.id}`,
                    toId: `image${item.id}Dest`,
                    duration: LONG_DURATION,
                    interpolation: {type: 'spring', ...SPRING_CONFIG},
                  },
                ],
                elementTransitions: [
                  {
                    id: 'title',
                    alpha: {
                      from: 0,
                      duration: SHORT_DURATION,
                    },
                    translationY: {
                      from: -16,
                      duration: SHORT_DURATION,
                    },
                  },
                  {
                    id: 'description',
                    alpha: {
                      from: 0,
                      duration: SHORT_DURATION,
                    },
                    translationY: {
                      from: 16,
                      duration: SHORT_DURATION,
                    },
                  },
                ],
              },
              pop: {
                content: {
                  alpha: {
                    from: 1,
                    to: 0,
                    duration: SHORT_DURATION * POP_MULTIPLIER,
                  },
                },
                sharedElementTransitions: [
                  {
                    fromId: `image${item.id}Dest`,
                    toId: `image${item.id}`,
                    duration: LONG_DURATION * POP_MULTIPLIER,
                    interpolation: {type: 'spring', ...SPRING_CONFIG},
                  },
                ],
                elementTransitions: [
                  {
                    id: 'title',
                    alpha: {
                      to: 0,
                      duration: SHORT_DURATION,
                    },
                    translationY: {
                      to: -16,
                      duration: SHORT_DURATION,
                    },
                  },
                  {
                    id: 'description',
                    alpha: {
                      to: 0,
                      duration: SHORT_DURATION,
                    },
                    translationY: {
                      to: 16,
                      duration: SHORT_DURATION,
                    },
                  },
                ],
              },
            },
          },
        },
      });
    };

    renderItem = ({item, index}) => {
      return <QuestionListItem item={item} index={index} onPress={this.onPressQuestion} />;
    };

    keyExtractor = (item) => item.id;

    renderRefreshControl = () => <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.onRefresh} />;

    render() {
      if (this.state.isLoading) {
        return <LoaderScreen message="Kraunami klausimai..." />;
      }

      return (
        <View flex useSafeArea>
          <FlatList
            data={this.state.questions}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            refreshControl={this.renderRefreshControl()}
          />
        </View>
      );
    }
  };
}
