import React from 'react';
import Styled from 'styled-components';
import Antd from 'react-native-vector-icons/AntDesign';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';

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

export default class ModalAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0
    };

  }

  onItemSelected = (selectedItem) => {
    this.props.onItemSelected(this.props.name, selectedItem);
    this.props.onClose();
  };

  render() {
    const { onClose, visible, count, name, message, type, ukuranBarang, data, transparent, color, uri } = this.props;

    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
                <View style={{ backgroundColor: '#fff', height: '90%' }}>
                    <Row>
                      <Col size={9}>
                      </Col>
                      <TouchableOpacity onPress={() => {this.props.onItemSelected(data[this.state.selectedItem]);this.props.onClose();}}>
                          <Text style={{ color: '#1470FE', fontSize: 17, textAlign: 'right', margin: 16, marginBottom: 10 }}>Close</Text>
                      </TouchableOpacity>
                    </Row>
                    <ScrollView style={{}}>
                      <View style={{ minHeight: 90, marginBottom: 20 }}>
                        {data.map((val, id) =>
                <TouchableOpacity key={id} onPress={() => this.onItemSelected(val)} style={{ padding: 12, borderBottomColor: '#E5E5E5', width: '100%', borderBottomWidth: id + 1 == data.length ? 0 : 2 }}>
                              <Row>
                                <Col>
                                  {val.nama_kelurahan ? <Text type='semiBold' color='#111'>{val.nama_kelurahan}</Text> :

                      val.nama_kecamatan ? <Text type='semiBold' color='#111'>{val.nama_kecamatan}</Text> :

                      val.nama_kota ? <Text type='semiBold' color='#111'>{val.nama_kota}</Text> :

                      val.nama_provinsi && <Text type='semiBold' color='#111'>{val.nama_provinsi}</Text>
                      }
                                </Col>
                              </Row>
                            </TouchableOpacity>
                )}
                      </View>

                      
                    </ScrollView>
                   
                </View>
                
            </Wrapper>
        </Modal>);

  }
}