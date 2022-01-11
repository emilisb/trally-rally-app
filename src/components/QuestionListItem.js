import React from 'react';
import {PixelRatio} from 'react-native';
import {ListItem, Text, AnimatableManager, Colors, BorderRadiuses} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';
import {getPointsLabel} from '../helpers/number-formats';
import {getQuestionType, getSubmissionStatus} from '../helpers/question-labels';
import {StyleSheet} from 'react-native';
import {getStaticUrl} from '../helpers/url';

export const QuestionListItem = React.memo(({item, index, onPress}) => {
  const animationProps = AnimatableManager.presets.fadeIn;
  const imageAnimationProps = AnimatableManager.getRandomDelay();

  const isLocked = item.locked;
  const imageSource = isLocked
    ? Icon.getImageSourceSync('lock', PixelRatio.getPixelSizeForLayoutSize(54), Colors.primaryColor)
    : {uri: getStaticUrl(item.image)};
  const subtitle = isLocked
    ? `Klausimas atsirakins ${item.maxDistance} m. atstumu nuo ieškomos vietos`
    : getQuestionType(item.type);

  const onPressItem = () => onPress(item, index);

  return (
    <Animatable.View {...animationProps}>
      <ListItem activeBackgroundColor={Colors.dark60} activeOpacity={0.3} height={77.5} onPress={onPressItem}>
        <ListItem.Part left>
          <Animatable.Image
            source={imageSource}
            style={styles.image}
            {...imageAnimationProps}
            nativeID={`image${item.id}`}
          />
        </ListItem.Part>
        <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
          <ListItem.Part marginB-3>
            <Text dark10 text70 flex marginR-10 numberOfLines={1}>
              {item.title}
            </Text>
            <Text dark10 text70 marginT-2>
              {getPointsLabel(item.points)}
            </Text>
          </ListItem.Part>
          <ListItem.Part>
            <Text flex marginR-10 text90 dark40 numberOfLines={2}>
              {subtitle}
            </Text>
            <Text text90 numberOfLines={1} color={item.submitted ? Colors.green20 : Colors.dark10}>
              {getSubmissionStatus(item.submitted)}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    </Animatable.View>
  );
});

const styles = StyleSheet.create({
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
