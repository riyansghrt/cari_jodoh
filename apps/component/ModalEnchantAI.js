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


export default class ModalEnchantAI extends React.Component {
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
    setTimeout(() => {
      this.props.onSubmit(name, val);
    }, 1000);
  };



  render() {
    const { onClose, visible, count, data, transparent, nameState, language, label, limitation, hapus } = this.props;
    //   if(!this.props.user) return <View />
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => undefined} {...this.props}>
                <View style={{ backgroundColor: '#fff', maxHeight: 400, borderRadius: 4, padding: 10 }}>
                  <ScrollView>
                    <Row>
                        <Text size={14} type='bold'>Peningkatan dengan AI</Text>
                        <Col style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                          <Row>
                            <Text textAlign='right'>Penggunaan:</Text> 
                            <Text color='#FF541F' type='semiBold'> {limitation?.usedRequests}/{limitation?.requestLimit}</Text>
                          </Row>
                        </Col>
                    </Row>
                    <Text textAlign='center' style={{ marginBottom: 12, marginTop: 30 }}>{'Mana yang ingin kamu tingkatkan?'}</Text>
                    <View style={{}}>
                        <TouchableOpacity onPress={() => this.onAdd('bio', null)} style={{ padding: 10, paddingRight: 0, borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }}>
                            <Row>
                                <Col>
                                    <Text type='bold' size={12}>{'tentang_saya'}</Text>
                                </Col>
                                <Col>
                                    <Feather style={{ textAlign: 'right' }} name='chevron-right' color={Colors.main} size={20} />
                                </Col>
                            </Row>
                        </TouchableOpacity>
                        <View style={{ padding: 10, paddingRight: 0, marginTop: 15 }}>
                            <Row>
                                <Col>
                                    <Text type='bold' size={12}>pengalaman_kerja</Text>
                                </Col>
                            </Row>
                        </View>
                        {data?.map((val, id) =>
                <TouchableOpacity onPress={() => this.onAdd('listExp', val)} style={{ padding: 10, paddingRight: 0, borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }}>
                                <Row>
                                    <Col>
                                        <Text size={12} type='medium'>{FormatType(val.judul)} - {val.nama_perusahaan}</Text>
                                    </Col>
                                    <Col size={2} style={{ justifyContent: 'center' }}>
                                        <Feather style={{ textAlign: 'right' }} name='chevron-right' color={Colors.main} size={20} />
                                    </Col>
                                </Row>
                            </TouchableOpacity>
                )}
                    </View>
                  </ScrollView>
                    <Button onPress={() => this.props.onClose()} label='tutup' style={{ margin: 10, marginTop: 30 }} />

                </View>
            </Wrapper>
        </Modal>);

  }
}