// ExperienceRangeModal.js
import React, { Component } from 'react';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Button from './Button';
import Text from './Text';
import { Col, Row } from './Grid';
import { Colors } from './Colors';

export default class ExperienceRangeModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        visible: props.visible,
        minExp: '',
        maxExp: '',
    };
  }

  open = () => this.setState({ visible: true });
  close = () => this.props.onClose()

  validateAndSubmit = () => {
    const { minExp, maxExp } = this.state;
    const min = parseInt(minExp, 10);
    const max = parseInt(maxExp, 10);

    if (!minExp || !maxExp) {
      Alert.alert('Error', 'Tahun pengalaman minimum dan maksimum harus diisi.');
      return;
    }

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
      Alert.alert('Error', 'Tahun pengalaman harus berupa angka positif.');
      return;
    }

    if (min > max) {
      Alert.alert('Error', 'Pengalaman minimum tidak boleh lebih besar dari maksimum.');
      return;
    }

    // Kirim ke parent lewat prop jika valid
    if (this.props.onSubmit) {
      this.props.onSubmit({ min, max });
    }

    this.setState({ visible: false, minExp: '', maxExp: '' });
  };

  render() {
    const { visible, minExp, maxExp } = this.state;

    return (
      <Modal visible={this.props.visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.label}>Tahun Pengalaman Minimum</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={minExp}
              onChangeText={text => this.setState({ minExp: text })}
            />

            <Text style={styles.label}>Tahun Pengalaman Maksimum</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={maxExp}
              onChangeText={text => this.setState({ maxExp: text })}
            />

            <Row style={{ marginTop: 12 }}>
                <Col style={{ marginRight: 6 }}>
                    <Button border color={Colors.main} label="Batal" onPress={this.close} />
                </Col>
                <Col>
                    <Button label="Simpan" onPress={this.validateAndSubmit} />
                </Col>
            </Row>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    color: '#000',
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
