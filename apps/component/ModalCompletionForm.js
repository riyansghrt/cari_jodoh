import React from 'react';
import Styled from 'styled-components';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import { TextInput } from 'react-native';
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


export default class ModalCompletionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 0,
      text: '' || props.value
    };

  }

  onSubmit = (name) => {

    this.props.onClose();
    setTimeout(() => {
      this.props.props.updateUserCompletion(name);

    }, 500);
  };



  render() {
    const { language } = this.props;
    const map = {
      nama: t(language, 'nama'),
      no_telp: t(language, 'nomor_telepon'),
      email: t(language, 'email'),
      bio: t(language, 'tentang_saya'),
      foto: t(language, 'foto_profil'),
      jenis_kelamin: t(language, 'jenis_kelamin'),
      tanggal_lahir: t(language, 'tanggal_lahir'),
      id_kota: t(language, 'alamat_domisili'),
      pengalaman: t(language, 'pengalaman'),
      skills: t(language, 'keahlian_dikuasai'),
      harapan_gaji: t(language, 'ekspektasi_gaji_minimal'),
      bahasa: t(language, 'kelancaran_bahasa'),
      listStudy: t(language, 'pendidikan_terakhir'),
      listExp: t(language, 'pengalaman_kerja'),
      listOrg: t(language, 'pengalaman_organisasi'),
      listSertifikasi: t(language, 'sertifikasi'),
      tipe_pekerjaan: t(language, 'tipe_pekerjaan'),
      lokasi: t(language, 'lokasi_pekerjaan'),
      status_pencarian: t(language, 'status_pencarian'),
      linkedin_url: t(language, 'profil_linkedin'),
      portofolio_url: t(language, 'portofolio')
    };
    const checkListUser = ['nama', 'no_telp', 'email', 'bio', 'foto',
    'jenis_kelamin', 'tanggal_lahir', 'id_kota'];

    const checklistFieldPref = [
    'pengalaman',
    'skills', 'harapan_gaji', 'bahasa', 'listStudy'];

    const additionalCvFields = [
      'listExp', 'listOrg', 'listSertifikasi', 'tipe_pekerjaan',
      'lokasi', 'status_pencarian', 'linkedin_url', 'portofolio_url'
    ];


    const { onClose, visible, count, message, nameState, type, title, data, transparent, label, hapus } = this.props;
    //   if(!this.props.user) return <View />
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => undefined} {...this.props}>
                <View style={{ backgroundColor: '#fff', borderRadius: 4, paddingHorizontal: 5 }}>
                    <Image source={require('../../assets/icon/imagecomplete.png')} resizeMode='contain' style={{ width: 214, alignSelf: 'center', height: 160 }} />
                    <Text size={16} type='bold' textAlign='center'>{t(language, 'lengkapi_data_resume')}!</Text>
                    {/* <Text textAlign='center' style={{ marginBottom: 12, marginTop: 4 }}>{t(language, 'isi_semua_data')}!</Text> */}
                    <Text textAlign='center' size={10} style={{ marginBottom: 12, marginTop: 4 }}>{t(language, 'data_belum_diisi')}:</Text> 
                    <ScrollView style={{ maxHeight: height * 0.45 }} contentContainerStyle={{ paddingHorizontal: 12 }}>
                        {checkListUser.map((val, id) =>
              <>
                                {!this.props.props.user?.user[val] && <TouchableOpacity onPress={() => this.onSubmit(val)} style={{ padding: 10, borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }}>
                                    <Row>
                                        <Col>
                                            <Text type='bold' size={12} color={Colors.main}>{map[val]}</Text>
                                        </Col>
                                        <Col style={{}}>
                                            <Feather style={{ textAlign: 'right' }} name='chevron-right' color={Colors.main} size={20} />
                                        </Col>
                                    </Row>
                                </TouchableOpacity>}
                            </>
              )}
                        {checklistFieldPref.map((val, id) =>
              <>
                                {(!this.props.props[val] || this.props.props[val]?.length == 0) && <TouchableOpacity onPress={() => this.onSubmit(val)} style={{ padding: 10, borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }}>
                                    <Row>
                                        <Col>
                                            <Text type='bold' size={12} color={Colors.main}>{map[val]}</Text>
                                        </Col>
                                        <Col size={2} style={{}}>
                                            <Feather style={{ textAlign: 'right' }} name='chevron-right' color={Colors.main} size={20} />
                                        </Col>
                                    </Row>
                                </TouchableOpacity>}
                            </>
              )}
                        {this.props.showAdditionalFields && additionalCvFields.map((val) =>
              <React.Fragment key={val}>
                                {(!this.props.props[val] && !this.props.props.user?.user[val] || this.props.props[val]?.length == 0) && <TouchableOpacity onPress={() => this.onSubmit(val)} style={{ padding: 10, borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }}>
                                    <Row>
                                        <Col>
                                            <Text type='bold' size={12} color={Colors.main}>{map[val]}</Text>
                                        </Col>
                                        <Col size={2}>
                                            <Feather style={{ textAlign: 'right' }} name='chevron-right' color={Colors.main} size={20} />
                                        </Col>
                                    </Row>
                                </TouchableOpacity>}
                            </React.Fragment>
              )}
                    </ScrollView>
                    <Button onPress={() => this.props.onClose()} label={t(language, 'tutup')} style={{ margin: 12 }} />
                    
                </View>
            </Wrapper>
        </Modal>);

  }
}
