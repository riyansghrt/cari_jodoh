import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';

const DISPLAY_DURATION = 5000;
const HIDDEN_OFFSET = -160;

const InAppNotification = forwardRef((props, ref) => {
  const insets = useSafeAreaInsets();
  const [notification, setNotification] = useState(null);
  const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const sequenceRef = useRef(0);

  const hide = useCallback(() => {
    const sequence = sequenceRef.current;
    clearTimeout(timerRef.current);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: HIDDEN_OFFSET,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished && sequence === sequenceRef.current) {
        setNotification(null);
      }
    });
  }, [opacity, translateY]);

  const show = useCallback(
    nextNotification => {
      if (!nextNotification?.title && !nextNotification?.body) {
        return;
      }

      sequenceRef.current += 1;
      clearTimeout(timerRef.current);
      translateY.stopAnimation();
      opacity.stopAnimation();
      translateY.setValue(HIDDEN_OFFSET);
      opacity.setValue(0);
      setNotification(nextNotification);

      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            damping: 18,
            stiffness: 180,
            mass: 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      });

      timerRef.current = setTimeout(hide, DISPLAY_DURATION);
    },
    [hide, opacity, translateY],
  );

  useImperativeHandle(ref, () => ({show, hide}), [hide, show]);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      translateY.stopAnimation();
      opacity.stopAnimation();
    },
    [opacity, translateY],
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) =>
        gestureState.dy < -8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy < -35) {
          hide();
          return;
        }

        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 180,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  if (!notification) {
    return null;
  }

  const handlePress = () => {
    const onPress = notification.onPress;
    hide();
    onPress?.();
  };

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.notification,
          {
            marginTop: insets.top + 8,
            opacity,
            transform: [{translateY}],
          },
        ]}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.82}
          onPress={handlePress}
          style={styles.content}>
          <View style={styles.icon}>
            <Feather color="#00906C" name="bell" size={18} />
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {notification.title || 'Cari Kerja'}
            </Text>
            {!!notification.body && (
              <Text numberOfLines={2} style={styles.body}>
                {notification.body}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Tutup notifikasi"
          accessibilityRole="button"
          activeOpacity={0.7}
          hitSlop={{top: 12, right: 12, bottom: 12, left: 12}}
          onPress={hide}
          style={styles.closeButton}>
          <Feather color="#667085" name="x" size={19} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 30,
  },
  notification: {
    minHeight: 70,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#101828',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 12,
  },
  content: {
    minWidth: 0,
    flex: 1,
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 42,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#E6F6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    color: '#101828',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  body: {
    color: '#475467',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InAppNotification;
