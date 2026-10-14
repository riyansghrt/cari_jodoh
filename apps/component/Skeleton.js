import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions } from 'react-native';

const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  baseColor = '#E0E0E0',
  highlightColor = '#F5F5F5',
  duration = 1200,
  style = {},
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  // convert width to numeric for animation only
  const numericWidth =
    typeof width === 'string'
      ? screenWidth * (parseFloat(width) / 100)
      : width;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animatedValue, duration]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-numericWidth, numericWidth],
  });

  return (
    <View
      style={[
        {
          backgroundColor: baseColor,
          overflow: 'hidden',
          borderRadius,
          width,
          height,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: highlightColor,
          opacity: 0.5,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

export default Skeleton;
