import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Colors } from './Colors';
import { t } from '../state/lang/UseLanguage';
import { Col, Row } from './Grid';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Text from './Text';

class SelectedJenisUsaha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.value || [],
      visible: true, // set true jika ingin langsung tampil
      data: [{
        name: 'perusahaan', 
        value: 1,
      },{
        name: 'umkm', 
        value: 2,
      },{
        name: 'koperasi', 
        value: 3,
      },{
        name: 'yayasan', 
        value: 4,
      }]
    };
  }

  toggleSelect = (item, full) => {
    const {justOne} = this.props
    const selected = this.state.selected;

    const index = selected.findIndex(val => val.value == item.value);
    if (index >= 0) selected.splice(index, 1);
    else {
      // if (selected.length === 3) return alert("Hanya bisa memilih 3 kategori pekerjaan");
      selected.push(item);
    }
    this.setState({ selected });
  };

  closeModal = () => {
    this.props.onClose()
  };

  saveValue = () => {
    const { selected } = this.state;
    this.props.onSubmit(selected);
    this.closeModal();
  };

  render() {
    const { experienceRange, visible,selected } = this.state;
    const {language} = this.props
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
              <View style={styles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.label} type='bold'>{t(language, 'Pilih Badan Usaha')}</Text>
                <View>
                    {this.state.data.map((item, idx) => (
                    <TouchableOpacity onPress={() => this.toggleSelect(item)} key={idx} style={{ paddingVertical: 10, borderBottomColor: '#ddd', borderBottomWidth: 0.5 }} activeOpacity={0.8}>
                        <Row>
                            <Text size={14} type='medium'>{item.name}</Text>
                            <Col>
                                {selected.some(vale => vale.value == item.value) ? <FontAwesome style={{textAlign: 'right'}} name='check-square' color={Colors.main} size={20} /> : <FontAwesome style={{textAlign: 'right'}} name='square-o' color={Colors.main} size={20} />}
                            </Col>
                        </Row>
                    </TouchableOpacity>
                    ))}
                </View>

                {/* Simpan Button */}
                <TouchableOpacity style={styles.saveButton} onPress={this.saveValue}>
                  <Text style={styles.saveText} type='semiBold'>simpan</Text>
                </TouchableOpacity>
              </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#6B7280', // Tailwind gray-500
  },
  label: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
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
    marginTop: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SelectedJenisUsaha;
