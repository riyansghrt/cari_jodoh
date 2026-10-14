import React from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { Colors } from './Colors';
const {width, height} = Dimensions.get('window');

class Loading extends React.Component {
  state = { visible: false };

  show = () => this.setState({ visible: true });
  hide = () => this.setState({ visible: false });

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent={true}
        animationType="fade"
        style={{ height }}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true} // penting untuk Android
      >
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.main} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    width, // pastikan full screen
    height: height+50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // semi transparan
  },
});

export default Loading;
