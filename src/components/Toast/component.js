import * as React from 'react';
import {StyleSheet} from 'react-native';
import {View, Constants, Toast} from 'react-native-ui-lib';

export default class ToastOverlay extends React.PureComponent {
  hideTimeout;

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };

    this.hideTimeout = setTimeout(this.hideToast, props.timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  hideToast = () => {
    this.setState({visible: false});
  };

  render() {
    // TODO remove hardcoded heights
    return (
      <View style={[styles.wrapper, {bottom: this.props.bottomMargin ? (Constants.isIOS ? 82 : 56) : 0}]}>
        <Toast visible={this.state.visible} position="bottom" {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    height: 48,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
