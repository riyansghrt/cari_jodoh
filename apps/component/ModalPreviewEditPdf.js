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


export default class ModalPreviewEditPdf extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 0,
      text: '' || props.value,
      list: []
    };

  }

  onAdd = (val) => {
    const { onClose, visible, count, data, transparent, nameState, language, label, hapus } = this.props;
    this.props.onClose();
    if (nameState == 'listExp') {
      setTimeout(() => {
        this.props.navigation.navigate('ExperienceJob', { item: { ...val, type: val ? 'edit' : 'add', isCv: true } });
      }, 500);
    }
    if (nameState == 'listOrg') {
      setTimeout(() => {
        this.props.navigation.navigate('ExperienceOrganization', { item: { ...val, type: val ? 'edit' : 'add', isCv: true } });
      }, 500);
    }
    if (nameState == 'listStudy') {
      setTimeout(() => {
        this.props.navigation.navigate('ExperienceStudy', { item: { ...val, type: val ? 'edit' : 'add', isCv: true } });
      }, 500);
    }
  };



  render() {
    const { onClose, visible, count, data, transparent, nameState, language, label, hapus } = this.props;

    //   if(!this.props.user) return <View />
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => undefined} {...this.props}>
                <View style={{ backgroundColor: '#fff', borderRadius: 4 }}>
                    <Image source={require('../../assets/icon/imagecomplete.png')} resizeMode='contain' style={{ width: 214, alignSelf: 'center', height: 160 }} />
                    <Text size={16} type='bold' textAlign='center'>{nameState == 'listExp' ? 'Ubah Data Pengalaman Kerja!' : nameState == 'listOrg' ? 'Ubah Data Pengalaman Organisasi!' : 'Ubah Data Pendidikan Terakhir!'}</Text>
                    <Text textAlign='center' style={{ marginBottom: 12, marginTop: 4 }}>{nameState == 'listExp' ? 'Pengalaman kerja kamu:' : nameState == 'listOrg' ? 'Pengalaman organisasi kamu:' : 'Pendidikan kamu:'}</Text>
                    <View style={{ paddingHorizontal: 12 }}>
                        {data?.map((val, id) =>
              <>
                            {!val.delete && <TouchableOpacity onPress={() => this.onAdd(val)} style={{ padding: 10, borderBottomColor: '#F0F0F0', borderBottomWidth: data.length - 1 == id ? 0 : 1 }}>
                                <Row>
                                    <Col>
                                        <Text type='bold' size={12} color={Colors.main}>{val.judul || val.jurusan} - {val.nama_perusahaan || val.name}</Text>
                                    </Col>
                                    <Col size={2}>
                                        <Feather style={{ textAlign: 'right' }} name='chevron-right' color={Colors.main} size={20} />
                                    </Col>
                                </Row>
                            </TouchableOpacity>}
                          </>
              )}

                        <TouchableOpacity onPress={() => this.onAdd()} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 12 }}>
                            <MaterialIcons name='add-circle-outline' color={Colors.main} style={{ marginRight: 4 }} />
                            <Text textAlign='center' type='bold' color={Colors.main}>{nameState == 'listExp' ? 'Tambah Pengalaman' : nameState == 'listOrg' ? 'Tambah Organisasi' : 'Tambah Pendidikan'}</Text>
                        </TouchableOpacity>
                    </View>
                    <Button onPress={() => this.props.onClose()} label='tutup' style={{ margin: 12 }} />
                    
                </View>
            </Wrapper>
        </Modal>);

  }
}
