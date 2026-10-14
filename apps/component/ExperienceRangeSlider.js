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

class ExperienceRangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experienceRange: [1, 30],
      visible: true // set true jika ingin langsung tampil
    };
  }

  handleValueChange = (values) => {
    this.setState({ experienceRange: values });
  };

  closeModal = () => {
    this.props.onClose();
  };

  saveValue = () => {
    const { experienceRange } = this.state;

    this.props.onSubmit({ min: experienceRange[0], max: experienceRange[1] });
    this.closeModal();
  };

  render() {
    const { experienceRange, visible } = this.state;
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
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.label}>{t(language, 'pengalaman_kerja')}</Text>
                <Text style={styles.value}>
                  {experienceRange[0]} - {experienceRange[1]} {t(language, 'tahun')}
                </Text>

                <MultiSlider
                  values={experienceRange}
                  onValuesChange={this.handleValueChange}
                  min={1}
                  max={30}
                  step={1}
                  allowOverlap={false}
                  snapped
                  containerStyle={styles.slider}
                  selectedStyle={styles.selectedTrack}
                  unselectedStyle={styles.unselectedTrack}
                  markerStyle={styles.marker}
                  pressedMarkerStyle={styles.markerPressed} />


                {/* Simpan Button */}
                <TouchableOpacity style={styles.saveButton} onPress={this.saveValue}>
                  <Text style={styles.saveText}>Simpan</Text>
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
    color: '#6B7280' // Tailwind gray-500
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

export default ExperienceRangeSlider;