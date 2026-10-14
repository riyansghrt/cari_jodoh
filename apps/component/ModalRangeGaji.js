// SalaryRangeModal.js
import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert } from
'react-native';
import Button from './Button';
import { Col, Row } from './Grid';
import { Colors } from './Colors';

const formatWithDots = (value) => {
  // Hapus semua karakter non-digit
  const cleaned = value.replace(/\D/g, '');

  // Format dengan titik pemisah ribuan
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default class ModalRangeGaji extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      minSalary: '',
      maxSalary: ''
    };
  }


  open = () => this.setState({ visible: true });
  close = () => this.props.onClose();

  validateAndSubmit = () => {
    const { minSalary, maxSalary } = this.state;

    const min = parseInt(minSalary.replace(/\./g, ''));
    const max = parseInt(maxSalary.replace(/\./g, ''));

    if (!minSalary || !maxSalary) {
      Alert.alert('Error', 'Gaji minimum dan maksimum harus diisi.');
      return;
    }

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
      Alert.alert('Error', 'Gaji harus berupa angka positif.');
      return;
    }

    if (min > max) {
      Alert.alert('Error', 'Gaji minimum tidak boleh lebih besar dari maksimum.');
      return;
    }

    // Jika valid, kirim ke parent lewat prop
    if (this.props.onSubmit) {
      this.props.onSubmit({ min, max });
    }

    this.setState({ visible: false, minSalary: '', maxSalary: '' });
  };

  render() {
    const { visible, minSalary, maxSalary } = this.state;

    return (
      <Modal visible={this.props.visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.label}>Gaji Minimum</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formatWithDots(minSalary)}
              onChangeText={(text) => this.setState({ minSalary: text })} />


            <Text style={styles.label}>Gaji Maksimum</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formatWithDots(maxSalary)}
              onChangeText={(text) => this.setState({ maxSalary: text })} />


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
      </Modal>);

  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    color: '#000',
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }
});