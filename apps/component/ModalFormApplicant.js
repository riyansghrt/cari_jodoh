import React from 'react';
import Styled from 'styled-components';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import { TextInput } from 'react-native';
import Button from './Button';
import Feather from "react-native-vector-icons/Feather";
import { t } from '../state/lang/UseLanguage';
import { Colors } from './Colors';
import { ShowToast } from './ShowToast';

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

const validate = (nama) => {
  if (nama == null) return false;
  const regex = /^(?!\s*$).+/;
  return regex.test(nama);
};


export default class ModalFormApplicant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: 0,
      text: props.value || '',
      firstName: props.value.firstName,
      lastName: props.value.lastName,
      email: props.value.email,
      loadingSubmit: false
    };

  }

  onSubmit = () => {
    const { firstName, lastName, email } = this.state;
    if (!validate(firstName)) return ShowToast('Nama depan wajib diisi');
    if (!validate(lastName)) return ShowToast('Nama belakang wajib diisi');
    this.props.onClose();
    this.props.onSubmit({ id: this.props.value.id, firstName, lastName, email });
  };

  render() {
    const { onClose, visible, count, message, nameState, type, title, language, data, transparent, label, hapus } = this.props;
    return (
      <Modal
        onShow={() => {
          //  this.inputRef.focus()
          Platform.OS == 'ios' ? this.inputRef.focus() :
          setTimeout(() => {
            if (this.inputRef) {
              this.inputRef.focus();
            }
          }, 500);
        }}
        transparent animationType='slide' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
                
                <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff' }}>
                      <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 16, paddingBottom: 0 }} onPress={() => {this.props.onClose();}}>
                            <Antd name='close' color='#000' size={20} />
                      </TouchableOpacity>
                      <View style={{ minHeight: 90, maxHeight: height / 1.5, marginBottom: 20, padding: 16, paddingTop: 0 }}>
                        <ScrollView keyboardShouldPersistTaps="handled">
                        <Text type='semiBold' style={{ marginBottom: 5 }}>Applicant 1</Text>
                        <Row>
                            <Col>
                                <Text size={10} style={{ marginBottom: 6 }} type='medium'>Nama Depan<Text color='red'>*</Text></Text>
                                <View style={{ paddingVertical: 12, marginBottom: 10, paddingHorizontal: 8, borderColor: '#00000050', borderWidth: 1, borderRadius: 8 }}>
                                <TextInput
                          ref={(ref) => this.inputRef = ref}
                          style={{ padding: 0, margin: 0, fontSize: 12, color: '#000', width: '100%', fontFamily: 'Onest-Regular' }}
                          placeholder={t(language, 'Nama Depan')}
                          keyboardType={'default'}
                          maxLength={1000}
                          multiline={this.props.nameState == 'bio' ? true : false}
                          onChangeText={(firstName) => this.setState({ firstName: firstName })}
                          value={this.state.firstName} />

                                </View>
                            </Col>
                            <Col style={{ paddingLeft: 5 }}>
                                <Text size={10} style={{ marginBottom: 6 }} type='medium'>Nama Belakang*<Text color='red'>*</Text></Text>
                                <View style={{ paddingVertical: 12, marginBottom: 10, paddingHorizontal: 8, borderColor: '#00000050', borderWidth: 1, borderRadius: 8 }}>
                                <TextInput
                          style={{ padding: 0, margin: 0, fontSize: 12, color: '#000', width: '100%', fontFamily: 'Onest-Regular' }}
                          placeholder={t(language, 'Nama Belakang')}
                          keyboardType={'default'}
                          maxLength={1000}
                          multiline={this.props.nameState == 'bio' ? true : false}
                          onChangeText={(lastName) => this.setState({ lastName: lastName })}
                          value={this.state.lastName} />

                                </View>
                            </Col>
                            
                        </Row>
                        <Text size={10} style={{ marginBottom: 6 }} type='medium'>Email</Text>
                        <View style={{ paddingVertical: 12, marginBottom: 10, paddingHorizontal: 8, borderColor: '#00000050', borderWidth: 1, borderRadius: 8 }}>
                          <TextInput
                      style={{ padding: 0, margin: 0, fontSize: 12, color: '#000', width: '100%', fontFamily: 'Onest-Regular' }}
                      placeholder={t(language, 'Email')}
                      keyboardType={'default'}
                      maxLength={1000}
                      multiline={this.props.nameState == 'bio' ? true : false}
                      onChangeText={(email) => this.setState({ email: email })}
                      value={this.state.email} />

                        </View>
                        <View style={{}}>

                          <TouchableOpacity activeOpacity={1} onPress={() => this.onSubmit(this.state.text)} style={{ backgroundColor: Colors.main,
                      paddingVertical: 11,
                      alignItems: "center",
                      borderRadius: 4
                    }}>
                                {this.state.loadingSubmit ? <ActivityIndicator color={'white'} /> :

                      <Text size={16} type="bold" color={Colors.white}>
                              {this.props.nameState == 'no_telp' || this.props.nameState == 'email' ? t(language, 'verifikasi') : t(language, 'simpan')}
                            </Text>}
                          </TouchableOpacity>
                          {/* <Button label={(this.props.nameState == 'no_telp' || this.props.nameState == 'email') ? t(language,'verifikasi') : t(language,'simpan')} onPress={() => this.onSubmit(this.state.text)} style={{ alignSelf: 'center', width: '100%', marginBottom: 30 }} /> */}
                        </View>
                        </ScrollView>
                      </View>
                </TouchableOpacity>
                </KeyboardAvoidingView>
            </Wrapper>
        </Modal>);

  }
}