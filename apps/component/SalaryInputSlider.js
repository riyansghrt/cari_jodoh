import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Text from './Text';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Colors } from './Colors';

class SalaryInputSlider extends Component {
  constructor(props) {
    super(props);
    const initialValue = 1000000;
    this.state = {
      visible: true,
      rawValue: initialValue.toString(),
      salary: initialValue,
      formatted: this.formatRupiah(initialValue.toString()),
      selection: { start: 0, end: 0 },
    };
  }

  closeModal = () => {
    this.props.onClose();
    this.setState({ visible: false });
  };

  formatRupiah = (value) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return 'Rp ' + parseInt(number, 10).toLocaleString('id-ID');
  };

  handleInputChange = (text) => {
    const raw = text.replace(/\D/g, '');
    const formatted = this.formatRupiah(raw);
    const clamped = Math.max(1_000_000, Math.min(parseInt(raw || '0', 10), 100_000_000));
    const delta = formatted.length - this.state.formatted.length;
    const nextCursor = Math.max(0, this.state.selection.start + delta);

    this.setState({
      rawValue: raw,
      salary: clamped,
      formatted,
      selection: { start: nextCursor, end: nextCursor },
    });
  };

  handleSliderChange = (values) => {
    const value = values[0];
    this.setState({
      salary: value,
      rawValue: value.toString(),
      formatted: this.formatRupiah(value.toString()),
      selection: { start: this.formatRupiah(value.toString()).length, end: this.formatRupiah(value.toString()).length }
    });
  };

  saveSalary = () => {
    this.props.onItemSelected(this.props.nameState, this.state.salary);
    this.closeModal();
  };

  render() {
    const { visible, salary, formatted, selection } = this.state;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={this.closeModal}
      >
        <TouchableWithoutFeedback onPress={this.closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                style={styles.modalContent}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              >
                <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.label}>gaji_diinginkan</Text>
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={formatted}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
                  onChangeText={this.handleInputChange}
                  selection={selection}
                  onSelectionChange={(e) =>
                    this.setState({ selection: e.nativeEvent.selection })
                  }
                />

                <MultiSlider
                  values={[salary]}
                  onValuesChange={this.handleSliderChange}
                  min={1_000_000}
                  max={100_000_000}
                  step={1_000_000}
                  allowOverlap={false}
                  snapped
                  containerStyle={styles.slider}
                  selectedStyle={styles.selectedTrack}
                  unselectedStyle={styles.unselectedTrack}
                  markerStyle={styles.marker}
                  pressedMarkerStyle={styles.markerPressed}
                />

                <TouchableOpacity style={styles.saveButton} onPress={this.saveSalary}>
                  <Text style={styles.saveText}>Simpan</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  slider: {
    height: 40,
    marginBottom: 24,
  },
  selectedTrack: {
    backgroundColor: Colors.main,
  },
  unselectedTrack: {
    backgroundColor: '#E5E7EB',
  },
  marker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: Colors.main,
  },
  markerPressed: {
    backgroundColor: Colors.main,
  },
  saveButton: {
    backgroundColor: Colors.main,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SalaryInputSlider;
