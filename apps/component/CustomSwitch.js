import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from './Colors';

export default class CustomSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(props.value ? 1 : 0),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      Animated.timing(this.state.animValue, {
        toValue: this.props.value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }

  toggleSwitch = () => {
    // TIDAK ada animasi di sini.
    const next = !this.props.value;
    this.props.onSwitch && this.props.onSwitch(next);
  };

  render() {
    const { colorSwitch } = this.props;
    const { animValue } = this.state;

    const onColor = '#fff';
    const offTrack = '#FFFFFF';
    const offThumb = colorSwitch || Colors.main;

    const thumbTranslate = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 20],
    });

    const trackBg = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [offTrack, colorSwitch || Colors.main],
    });

    const thumbBg = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [offThumb, onColor],
    });

    return (
      <TouchableWithoutFeedback onPress={this.toggleSwitch}>
        <View style={[styles.container, { borderColor: colorSwitch || Colors.main }]}>
          <Animated.View style={[styles.track, { backgroundColor: trackBg }]} />
          <Animated.View
            style={[
              styles.thumb,
              { transform: [{ translateX: thumbTranslate }], backgroundColor: thumbBg },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    overflow: 'hidden',
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    top: 2,
    left: 2,
  },
});
