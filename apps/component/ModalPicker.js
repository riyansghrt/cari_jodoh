import React from 'react';
import Styled from 'styled-components';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import FormatType from './FormatType';

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

export default class ModalPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0
    };

  }

  onItemSelected = (selectedItem) => {
    this.props.onItemSelected(selectedItem);
    this.props.onClose();
  };

  render() {
    const { onClose, visible, count, message, type, ukuranBarang, data, transparent, color, uri } = this.props;
    const safeData = Array.isArray(data) ? data : [];
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
                <View style={{ backgroundColor: '#fff' }}>

                            <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 16, paddingBottom: 0 }} onPress={() => {this.props.onClose();}}>
                                  <Antd name='close' color='#000' size={20} />
                            </TouchableOpacity>
                      {/* <TouchableOpacity onPress={() => {this.props.onItemSelected(data[this.state.selectedItem]); this.props.onClose()}}>
                 <Text style={{ color: '#1470FE', fontSize: 17, textAlign: 'right', margin: 16, marginBottom: 10 }}>Close</Text>
              </TouchableOpacity> */}
                    
                    <ScrollView style={{}}>
                      <View style={{ minHeight: 90, marginBottom: 25 }}>
                        {safeData?.map((val, id) =>
                <TouchableOpacity onPress={() => this.onItemSelected(val)} style={{ padding: 12, borderBottomColor: '#E5E5E5', width: '100%', borderBottomWidth: id + 1 == safeData.length ? 0 : 2 }}>
                              <Row>
                                <Col>
                                  {val.GoodsType && <Text type='semiBold' textAlign='center' color='#111'>{val.GoodsType} Hari</Text>}
                                  {val.BRANCH_NAME && <Text type='semiBold' size={14} textAlign='center' color='#111'>{val.BRANCH_NAME}</Text>}
                                  {val.name && <Text type='semiBold' textAlign='center' color='#111'>{FormatType(val.name)}</Text>}
                                  {val.bahasa && <Text type='semiBold' size={14} textAlign='center' color='#111'>{val.bahasa}</Text>}
                                  {val.singkatan && <Text type='semiBold' textAlign='center' color='#111'>{val.singkatan} ({val.nama})</Text>}
                                </Col>
                                {val.ukuran && <Col>
                                  <Text textAlign='right' type='semiBold' color='#11111180'>Maks. {val.ukuran}kg</Text>
                                </Col>}
                              </Row>
                            </TouchableOpacity>
                )}
                        {ukuranBarang && <View style={{ backgroundColor: '#eee', padding: 20 }}>
                          <Row style={{ alignItems: 'center' }}>
                            <Col style={{ paddingLeft: 12 }}>
                              <Text type='bold' size={13}>Pastiin berat paket tidak melebihi ukuran & berat ya</Text>
                              <Text size={12} color='#11111180'>Agar mitra dan paket kamu aman.</Text>
                            </Col>
                          </Row>
                        </View>}
                      </View>

                      
                    </ScrollView>
                   
                </View>
                
            </Wrapper>
        </Modal>);

  }
}
