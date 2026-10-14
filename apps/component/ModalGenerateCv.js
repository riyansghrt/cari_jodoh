import React from 'react';
import Styled from 'styled-components';
import Feather from 'react-native-vector-icons/Feather';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import { Colors } from './Colors';
import Button from './Button';
import Toast from 'react-native-simple-toast';
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
    minWidth: 1px
  `;

const ContainerIndicator = Styled(View)`
    background-color : #ffff;
    padding : 5px;
    border-radius : 5px;
  `;

const BodyText = Styled(View)`
    width: 100%
    margin-top: 15px;
    justify-content: center;
  `;

const MessageText = Styled(Text)`
    textAlign: center;
  `;

let countries = [
{ name: 'Indonesia', flag: <Image source={require('../../assets/icon/indo.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'Amerika', flag: <Image source={require('../../assets/icon/us.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'Australia', flag: <Image source={require('../../assets/icon/aussie.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'Canada', flag: <Image source={require('../../assets/icon/canada.png')} style={{ height: 18, width: 18, marginRight: 3 }} />, available: true },
{ name: 'Jepang', flag: <Image source={require('../../assets/icon/jepang.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'United Kingdom', flag: <Image source={require('../../assets/icon/uk.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'Korea', flag: <Image source={require('../../assets/icon/kor.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'Arab Saudi', flag: <Image source={require('../../assets/icon/sau.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'German', flag: <Image source={require('../../assets/icon/ger.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'Taiwan', flag: <Image source={require('../../assets/icon/taw.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: true },
{ name: 'China', flag: <Image source={require('../../assets/icon/china.png')} style={{ height: 16, width: 16, marginRight: 3 }} />, available: false }];

export default class ModalGenerateCv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0,
      isCombo: false,
      selectedCountry: null
    };

  }

  onItemSelected = (selectedItem) => {
    this.props.onItemSelected(selectedItem);
    this.props.onClose();
  };

  onSubmit = (selectedItem) => {
    if (!this.state.selectedCountry) return ShowToast('pilih_negara_terlebih_dahulu');
    this.props.onClose();
    this.props.onGenerate(this.state.selectedCountry);
  };

  render() {
    const flagSel = {
      Indonesia: <Image source={require('../../assets/icon/indo.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      Amerika: <Image source={require('../../assets/icon/us.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      Jepang: <Image source={require('../../assets/icon/jepang.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      China: <Image source={require('../../assets/icon/china.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      Canada: <Image source={require('../../assets/icon/canada.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      Australia: <Image source={require('../../assets/icon/aussie.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      'United Kingdom': <Image source={require('../../assets/icon/uk.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      'Korea': <Image source={require('../../assets/icon/kor.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      'German': <Image source={require('../../assets/icon/ger.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      'Taiwan': <Image source={require('../../assets/icon/taw.png')} style={{ height: 16, width: 16, marginRight: 3 }} />,
      'Arab Saudi': <Image source={require('../../assets/icon/sau.png')} style={{ height: 16, width: 16, marginRight: 3 }} />
    };
    const { onClose, visible, count, message, type, ukuranBarang, data, transparent, color, uri } = this.props;
    const { isCombo, selectedCountry } = this.state;


    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                      
                    <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 16, paddingBottom: 0 }} onPress={() => {this.props.onClose();}}>
                          <Antd name='close' color='#000' size={20} />
                    </TouchableOpacity>
                    
                    <ScrollView style={{}}>
                      <View style={{ minHeight: 210, marginBottom: 20, paddingHorizontal: 16 }}>
                        <Text size={14} type='semiBold' style={{ marginBottom: 8 }}>Pilih template CV Profesional kamu!</Text>
                        <View style={{ borderColor: '#C9C9C9', borderWidth: 1, borderRadius: 4, marginBottom: 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ isCombo: !isCombo })} activeOpacity={0.9} style={{ padding: 12, borderBottomColor: '#C9C9C9', borderBottomWidth: 1 }}>
                                <Row style={{ alignItems: 'center' }}>
                                    <Text style={{ marginLeft: selectedCountry ? 4 : 0 }} type='semiBold'>{selectedCountry ? selectedCountry : ' Pilih Negara'}</Text>
                                    <Col>
                                        <Feather style={{ textAlign: 'right' }} name='chevron-down' color={Colors.text} />
                                    </Col>
                                </Row>

                            </TouchableOpacity>
                            {isCombo && countries.map((val, id) =>
                  <TouchableOpacity onPress={() => {val.available ? this.setState({ selectedCountry: val.name, isCombo: false }) : undefined;}} activeOpacity={0.9} style={{ paddingVertical: 6, paddingHorizontal: 12 }}>
                                <Row>
                                    {val.flag}
                                    <Col>
                                        <Text type='semiBold' color={val.available ? Colors.text : '#777777'}> {val.name} <Text size={10} color={val.available ? Colors.text : '#777777'}>{val.available ? '' : '(Akan datang)'}</Text></Text>
                                    </Col>
                                </Row>
                            </TouchableOpacity>
                  )}
                        </View>
                      </View>

                      
                    </ScrollView>
                        <Button onPress={() => this.onSubmit()} label='buat_cv_profesional' style={{ width: '90%', alignSelf: 'center', marginBottom: 40 }} />
                   
                </View>
                
            </Wrapper>
        </Modal>);

  }
}