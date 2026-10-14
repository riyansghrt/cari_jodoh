import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from './Text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from './Colors';

export default class HighlightPopupLamaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dontShow: false
    };
  }

  async componentDidMount() {
    // Cek apakah user sebelumnya menonaktifkan popup
    const hide = await AsyncStorage.getItem('hideHighlightPopup');

    if (hide != 'true') {

      this.setState({ visible: true });
    }
  }

  handleClose = async () => {
    if (this.state.dontShow) {
      await AsyncStorage.setItem('hideHighlightPopup', 'true');
    }
    this.setState({ visible: false });
    setTimeout(() => {
      this.props?.onHandleClose();
    }, 1000);
  };

  render() {
    const { visible, dontShow } = this.state;

    return (
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              width: '85%',
              paddingVertical: 30,
              padding: 14,
              alignItems: 'center'
            }}>
            {/* Ganti gambar dengan area gelap */}
            <Image
              source={require('../../assets/icon/premiumlamaran.png')}
              resizeMode='contain'
              style={{
                height: 160,
                marginBottom: 20
              }} />


            <Text type='bold' style={{ fontSize: 16, textAlign: 'center', marginBottom: 8 }}>Ingin Lamaran Kamu Jadi Sorotan?</Text>
            <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16 }}>Tunjukkan antusiasme kamu dan jadikan lamaran kamu sorotan utama bagi para rekruter.</Text>

            {/* <TouchableOpacity onPress={() => this.setState({ dontShow: !this.state.dontShow })} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
               <View style={{ borderColor: this.state.dontShow ? Colors.main : '#CACACA', marginRight: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 1, height: 18, width: 18, borderRadius: 4 }}>
                 {this.state.dontShow && <AntDesign name='check' size={16} style={{ textAlign: 'center' }} color={Colors.main} />}
               </View>
               <Text style={{  fontSize: 13 }}>Jangan tampilkan lagi untuk saat ini.</Text>
              </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => {this.setState({ visible: false });setTimeout(() => {
                  this.props.onPay();
                }, 1000);}}
              style={{
                backgroundColor: Colors.main,
                paddingVertical: 12,
                borderRadius: 8,
                width: '100%',
                marginBottom: 16
              }}>
              <Text type='bold' style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>
                Prioritaskan Lamaran Saya
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleClose}>
              <Text type='medium' style={{ color: '#00A676' }}>Mungkin Lain Kali</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>);

  }
}