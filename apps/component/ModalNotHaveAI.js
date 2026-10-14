import React from 'react';
import Styled from 'styled-components';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import { TextInput } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Button from './Button';
import Feather from "react-native-vector-icons/Feather";
import { Colors } from './Colors';
import { t } from '../state/lang/UseLanguage';
import FormatType from './FormatType';
// import { snackBarError } from './snackBar';

const { width, height } = Dimensions.get('window');

const Wrapper = Styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.6);
  justifyContent: center;
  padding: 16px;
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


export default class ModalNotHaveAI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 0,
      text: '' || props.value,
      list: []
    };

  }

  onAdd = (name, val) => {
    this.props.onClose();
    this.props.onSubmit();
  };

  render() {
    const { onClose, visible, count, data, transparent, nameState, language, label, limitation, hapus } = this.props;
    //   if(!this.props.user) return <View />
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => undefined} {...this.props}>
                <View style={{ backgroundColor: '#fff', maxHeight: 400, borderRadius: 16, padding: 12 }}>
                    <Image source={require('../../assets/icon/confuse.png')} resizeMode='contain' style={{ height: 160, width: 155, alignSelf: 'center' }} />
                    <Text size={16} type='bold' textAlign='center' style={{ marginTop: 12, marginBottom: 8 }}>Sayang Sekali</Text>
                    <Text textAlign='center'>Kesempatan kamu untuk meningkatkan profil maupun resume dengan AI sudah habis, dapatkan kesempatan sebanyak 20x dengan membeli ulang.</Text>
                    <Button onPress={() => this.onAdd()} label='Lanjut ke Metode Pembayaran' style={{ marginHorizontal: 10, marginTop: 30 }} />
                    <TouchableOpacity onPress={() => this.props.onClose()} style={{ paddingVertical: 16 }}>
                        <Text size={14} type='medium' textAlign='center'>Tutup</Text>
                    </TouchableOpacity>
                </View>
            </Wrapper>
        </Modal>);

  }
}