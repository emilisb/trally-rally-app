import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {View, LoaderScreen} from 'react-native-ui-lib';
import {SCREENS} from '../navigation/screens';
import {QuestionListItem} from '../components/QuestionListItem';

const MULTIPLIER = 1.2;
const POP_MULTIPLIER = 1.0;
const LONG_DURATION = 540 * MULTIPLIER;
const SHORT_DURATION = 210 * MULTIPLIER;

const SPRING_CONFIG = {mass: 2, damping: 500, stiffness: 200};

export default function homeScreen(serverApi) {
  return class HomeScreen extends React.PureComponent {
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
      isLoading: true,
      isRefreshing: false,
    };

    componentDidMount() {
      this.loadData();
    }

    loadData = async () => {
      const questions = await serverApi.fetchQuestions();
      this.setState({questions, isLoading: false});
    };

    onRefresh = async () => {
      this.setState({isRefreshing: true});
      await this.loadData();
      this.setState({isRefreshing: false});
    };

    onPressQuestion = (item, index) => {
      Navigation.push(this.props.componentId, {
        component: {
          name: SCREENS.QUESTION,
          passProps: {
            item,
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
