import React from 'react';
import {Image} from 'react-native';

export default class ScaledImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {source: {uri: this.props.uri}};
  }

  componentWillMount() {
    Image.getSize(this.props.uri, (width, height) => {
      if (this.props.width && !this.props.height) {
        this.setState({
          width: this.props.width,
          height: height * (this.props.width / width),
        });
      } else if (!this.props.width && this.props.height) {
        this.setState({
          width: width * (this.props.height / height),
          height: this.props.height,
        });
      } else {
        this.setState({width, height});
      }
    });
  }

  render() {
    const {imageProps, customStyle} = this.props;
    const {height, width, source} = this.state;
    return <Image source={source} style={{...customStyle, height, width}} {...imageProps} />;
  }
}
