import React from 'react';
import Styled from 'styled-components';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import { TextInput } from 'react-native';
import Button from './Button';
// import { snackBarError } from './snackBar';

const { width, height } = Dimensions.get('window');

const Wrapper = Styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.6);
  justifyContent: flex-end;
  flex: 1;
  `;

const Body = Styled(View)`
    background-color: ${(props) => props.transparent ? 'transparent' : 'transparent'};
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    minWidth: 1px;
  `;

const ContainerIndicator = Styled(View)`
    background-color : #ffff;
    padding : 5px;
    border-radius : 5px;
  `;

const formatWithDots = (value) => {
  // Hapus semua karakter non-digit
  const cleaned = value.replace(/\D/g, '');

  // Format dengan titik pemisah ribuan
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};


export default class ModalPreference extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 0,
      text: ''
    };

  }

  onSubmit = (selectedItem) => {
    if (this.state.text == 'hapus') {
      this.props.onItemSelected(this.props.nameState, selectedItem);
    } else {
      this.props.onItemSelected(this.props.nameState, parseInt(selectedItem.replace(/\./g, '')));

      // snackBarError('Kata tidak sesuai, anda harus mengetik hapus')
    }
  };



  render() {
    const { onClose, visible, count, message, nameState, type, title, data, transparent, label, hapus } = this.props;
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => undefined} {...this.props}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
                
                <View style={{ backgroundColor: '#fff' }}>
                      
                      <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 16, paddingBottom: 0 }} onPress={() => {this.props.onClose();}}>
                            <Antd name='close' color='#000' size={20} />
                      </TouchableOpacity>
                      <View style={{ minHeight: 90, marginBottom: 20, padding: 16 }}>
                        {hapus && <Image source={require('../../assets/icon/imageDelete.png')} style={{ height: 120, width: 125, alignSelf: 'center', marginBottom: 5 }} />}
                        <Text type='bold' size={14} style={{ marginBottom: 12 }} textAlign='center'>{title ? title : hapus ? 'Apakah Anda yakin untuk menghapus akun?' : ''}</Text>
                        {label && <Text style={{ marginBottom: 16 }} textAlign='center' type='medium'>{hapus ? 'Untuk memastikan tidak adanya unsur ketidaksengajaan. Ketik “hapus” pada kolom di bawah untuk menghapus Anda.' : label}</Text>}
                        <View style={{ paddingVertical: 8, marginBottom: 10, paddingHorizontal: 16, borderColor: '#00000050', borderWidth: 1, borderRadius: 8 }}>
                          <TextInput
                    style={{ padding: 0, margin: 0, color: '#000', width: '100%' }}
                    placeholder=''
                    keyboardType='phone-pad'
                    onChangeText={(text) => this.setState({ text: formatWithDots(text) })}
                    value={this.state.text} />

                        </View>
                        <View style={{}}>
                          <Button label='Kirim' onPress={() => this.onSubmit(this.state.text)} style={{ alignSelf: 'center', width: '100%', marginBottom: 30 }} />
                        </View>
                      </View>
                </View>
                </KeyboardAvoidingView>
            </Wrapper>
        </Modal>);

  }
}