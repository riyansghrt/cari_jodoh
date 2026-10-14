import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback } from
'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Colors } from './Colors';
import { t } from '../state/lang/UseLanguage';

class SalaryRangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true, // set false jika ingin dikontrol dari parent
      salaryRange: [1, 100] // 10K - 100K
    };
  }

  closeModal = () => {
    this.props.onClose();
    this.setState({ visible: false });
  };

  handleSalaryChange = (values) => {
    this.setState({ salaryRange: values });
  };

  formatRupiah = (valInK) => {
    const value = valInK * 1000000;
    return 'Rp ' + value.toLocaleString('id-ID');
  };

  saveData = () => {
    const { salaryRange } = this.state;
    const min = salaryRange[0] * 1000000;
    const max = salaryRange[1] * 1000000;

    this.props.onSubmit({ min, max });
    this.closeModal();
  };

  render() {
    const { visible, salaryRange } = this.state;
    const { language } = this.props;
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={this.closeModal}>

        <TouchableWithoutFeedback onPress={this.closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.label}>{t(language, 'range_gaji')}</Text>
                <Text style={styles.value}>
                  {this.formatRupiah(salaryRange[0])} - {this.formatRupiah(salaryRange[1])}
                </Text>

                <MultiSlider
                  values={salaryRange}
                  onValuesChange={this.handleSalaryChange}
                  min={1}
                  max={100}
                  step={1}
                  allowOverlap={false}
                  snapped
                  containerStyle={styles.slider}
                  selectedStyle={styles.selectedTrack}
                  unselectedStyle={styles.unselectedTrack}
                  markerStyle={styles.marker}
                  pressedMarkerStyle={styles.markerPressed} />


                <TouchableOpacity style={styles.saveButton} onPress={this.saveData}>
                  <Text style={styles.saveText}>{t(language, 'simpan')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>);

  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center'
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  slider: {
    height: 40,
    marginBottom: 24
  },
  selectedTrack: {
    backgroundColor: Colors.main
  },
  unselectedTrack: {
    backgroundColor: '#E5E7EB'
  },
  marker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: Colors.main
  },
  markerPressed: {
    backgroundColor: Colors.main
  },
  saveButton: {
    backgroundColor: Colors.main,
    paddingVertical: 12,
    borderRadius: 8
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16
  }
});

export default SalaryRangeSlider;