import React from 'react';
import {SafeAreaView, FlatList, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {ListItem, Text, AnimatableManager, Colors, BorderRadiuses, LoaderScreen} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import {getPointsLabel} from '../helpers/number-formats';
import {getQuestionType, getSubmissionStatus} from '../helpers/question-labels';
import {SCREENS} from '../navigation/screens';

const MULTIPLIER = 1.2;
const POP_MULTIPLIER = 1.0;
const LONG_DURATION = 540 * MULTIPLIER;
const SHORT_DURATION = 210 * MULTIPLIER;

const SPRING_CONFIG = {mass: 2, damping: 500, stiffness: 200};

export default function homeScreen(serverApi) {
  return class HomeScreen extends React.PureComponent {
    state = {
      questions: [],
      isLoading: true,
    };

    componentDidMount() {
      this.loadData();
    }

    async loadData() {
      const questions = await serverApi.fetchQuestions();
      this.setState({questions, isLoading: false});
    }

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
      const animationProps = AnimatableManager.presets.fadeIn;
      const imageAnimationProps = AnimatableManager.getRandomDelay();
      const onPress = () => this.onPressQuestion(item, index);

      return (
        <Animatable.View {...animationProps}>
          <ListItem activeBackgroundColor={Colors.dark60} activeOpacity={0.3} height={77.5} onPress={onPress}>
            <ListItem.Part left>
              <Animatable.Image
                source={{uri: item.image}}
                style={styles.image}
                {...imageAnimationProps}
                nativeID={`image${item.id}`}
              />
            </ListItem.Part>
            <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
              <ListItem.Part containerStyle={{marginBottom: 3}}>
                <Text dark10 text70 style={{flex: 1, marginRight: 10}} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text dark10 text70 style={{marginTop: 2}}>
                  {getPointsLabel(item.points)}
                </Text>
              </ListItem.Part>
              <ListItem.Part>
                <Text style={{flex: 1, marginRight: 10}} text90 dark40 numberOfLines={1}>
                  {getQuestionType(item.type)}
                </Text>
                <Text text90 numberOfLines={1} color={item.submitted ? Colors.green20 : Colors.dark10}>
                  {getSubmissionStatus(item.submitted)}
                </Text>
              </ListItem.Part>
            </ListItem.Part>
          </ListItem>
        </Animatable.View>
      );
    };

    keyExtractor = (item) => item.id;

    render() {
      if (this.state.isLoading) {
        return <LoaderScreen message="Kraunami klausimai..." />;
      }

      return (
        <SafeAreaView style={styles.container}>
          <FlatList data={this.state.questions} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />
        </SafeAreaView>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark70,
  },
});
