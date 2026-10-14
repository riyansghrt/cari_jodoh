import React, { Component } from 'react';
import { Animated, Text, View } from 'react-native';

class Marquee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animatedX: new Animated.Value(0),
      textWidth: 0,
      ready: false,
    };
  }

  startScroll = () => {
    const { animatedX, textWidth } = this.state;
    const duration = this.props.duration || 15000;

    animatedX.setValue(0);

    Animated.loop(
      Animated.timing(animatedX, {
        toValue: -textWidth,
        duration,
        useNativeDriver: true,
      })
    ).start();
  };

  render() {
    const { animatedX, textWidth } = this.state;
    const text =
      this.props.text ||
      'Breaking news: React Native marquee tanpa library akhirnya bisa berhasil!';

    return (
      <View style={{ width: '100%', overflow: 'hidden' }}>
        
        {/* ukur panjang teks */}
        <Text
          style={{
            position: 'absolute',
            opacity: 0,
            color:'#575757',
            fontFamily: 'Onest-Regular',
            fontSize: 12,
          }}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            this.setState({ textWidth: w, ready: true }, this.startScroll);
          }}
        >
          {text}
        </Text>

        {textWidth > 0 && (
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ translateX: animatedX }],
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color:'#575757',
                fontFamily: 'Onest-Regular',
                width: textWidth + 2000, // 🔥 ANTI WRAP
              }}
            >
              {text}
            </Text>

            <Text
              style={{
                fontSize: 12,
                color:'#575757',
                fontFamily: 'Onest-Regular',
                marginLeft: 50,
                width: textWidth + 2000, // 🔥 ANTI WRAP
              }}
            >
              {text}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  }
}

export default Marquee;
