import React from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

/**
 * SafeAreaWrapper — versi hanya lindungi area bawah (gesture bar),
 * tapi biarkan area atas mentah untuk gambar/header yang full-bleed.
 */
export default function SafeAreaWrapper({ children, bottomInset = true, backgroundColor = '#fff' }) {
  return (
    <SafeAreaInsetsContext.Consumer>
      {insets => (
        <View
          style={{
            flex: 1,
            // hanya pakai padding bawah
            paddingBottom: bottomInset ? (insets?.bottom ?? 0) : 0,
            backgroundColor,
          }}
        >
          {children}
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}
