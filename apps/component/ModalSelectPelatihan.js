// SwipeModal.js
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Modal } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import { Colors } from './Colors';
import moment from 'moment';
import Antd from 'react-native-vector-icons/AntDesign';
import FormatMoney from './FormatMoney';

import Toast from 'react-native-simple-toast';
import Feather from "react-native-vector-icons/Feather";
import styled from 'styled-components';
import { ShowToast } from './ShowToast';

const { width } = Dimensions.get('window');

const Wrapper = styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.6);
  justifyContent: flex-end;
  flex: 1;
  `;

export default class ModalSelectPelatihan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: "",
      full: null,
      selected: props.selected || [],
      source: [],
      sesi: [],
      dateSelected: null,
      sesiSelected: null,
      scheduleSelected: null,
      addOnSelected: []
    };
    this.typingTimeout = null;
  }

  toggleModal = () => {
    const { user, token } = this.props.user;
    const { sesi, dateSelected, addOnSelected, scheduleSelected, sesiSelected } = this.state;
    if (!scheduleSelected) return ShowToast('pilih_tanggal_terlebih_dahulu');
    if (scheduleSelected.sessions.length > 0) {
      if (!sesiSelected) return ShowToast('pilih_sesi_terlebih_dahulu');

    }
    const dataq = {
      "training_schedule_id": scheduleSelected.id,
      "addonIds": addOnSelected,
      "subscriber_id": user.id,
      "session_id": sesiSelected ? sesiSelected.id : null,
      "fixed_date": dateSelected
    };
    this.props.onClose();
    setTimeout(() => {
      this.props.navigation.navigate('TinjauPelatihan', { item: { dataq, data: this.props.data }, name: 'pelatihan' });
    }, 500);

  };

  onAddDelete = (id, source) => {
    const selected = this.state.addOnSelected;

    const index = selected.findIndex((val) => val.id == id.id);
    if (index >= 0) selected.splice(index, 1);else
    {
      //   if (selected.length === 3) return alert("Hanya bisa memilih 3 kategori pekerjaan");
      selected.push(id);
    }
    this.setState({ addOnSelected: selected });
  };

  total() {
    const { sesi, dateSelected, addOnSelected, scheduleSelected, sesiSelected } = this.state;


    let total = 0;
    if (this.props.data) {
      if (addOnSelected.length > 0) {
        for (const element of this.state.addOnSelected) {
          total = total + element.price;
        }
      }
      total = total + (this.props.data.original_price - this.props.data.discount_price);
    }

    return total;
  }

  render() {
    const { visible, onClose, data, title } = this.props;
    const { sesi, dateSelected, scheduleSelected, addOnSelected, sesiSelected } = this.state;

    return (

      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
        <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
        <TouchableOpacity activeOpacity={1} style={{
            backgroundColor: '#fff',
            padding: 16,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: 150
          }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end', padding: 16, paddingVertical: 0 }} onPress={() => {this.props.onClose();}}>
                  <Antd name='close' color='#000' size={20} />
            </TouchableOpacity>
          <Text style={{ marginBottom: 8 }} textAlign='left' size={16} type='semiBold'>{data.name}</Text>
          <Text size={10} type='bold' color={Colors.main} style={{ marginBottom: 4 }}>Pilih Tanggal</Text>
          <View>
            <Row style={{ flexWrap: 'wrap', marginBottom: 13 }}>
                {data.schedules.map((val, id) =>
                <>
                        {val.option_date.map((valx, idx) =>
                  <TouchableOpacity onPress={() => this.setState({ scheduleSelected: val, sesi: val.sessions, sesiSelected: null, dateSelected: valx })} style={{ borderColor: Colors.border, backgroundColor: dateSelected == valx ? Colors.main : Colors.white, borderRadius: 4, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 }}>
                                <Text type='medium' color={dateSelected == valx ? Colors.white : Colors.text}>{moment(valx).format('dddd, DD MMMM YYYY')}</Text>
                            </TouchableOpacity>
                  )} 
                    </>
                )}
            </Row>  
            {sesi.length > 0 && <View style={{ marginBottom: 24 }}>
                <Text style={{ marginBottom: 12 }} type='bold' size={10} color={Colors.main}>Sesi</Text>
                {sesi.map((val, id) =>
                <Row style={{ marginBottom: 12 }}>
                        <Col size={8} style={{ justifyContent: 'center' }}>
                            <Text size={14} type={'regular'} color={'#575757'}>Sesi {val.session_name}</Text>
                            <Text size={10} type={'regular'} color={'#575757'}>Jam {val.start_time} - {val.end_time}</Text>
                        </Col>
                        <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ sesiSelected: val })} style={{ height: 20, width: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderColor: '#575757', borderWidth: 1 }}>
                                {!sesiSelected ? <></> :
                      val.id == sesiSelected.id ? <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: Colors.main }} /> :
                      <></>
                      }
                            </TouchableOpacity>
                        </Col>
                    </Row>
                )}
            </View>}
            {data.addons?.length > 0 && <View style={{}}>
                <Text style={{ marginBottom: 12 }} type='bold' size={10} color={Colors.main}>Extra</Text>
                {data.addons?.map((val, id) =>
                <>
                    <Row style={{ marginBottom: 12 }}>
                        <View size={8} style={{ width: '80%', justifyContent: 'center', maxHeight: 50 }}>
                            <Text size={14} type={'regular'} color={'#575757'}>{val.name} ({FormatMoney.getFormattedMoney(val.price, 'Rp')})</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: '20%', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.onAddDelete(val, data.addons)} style={{ height: 20, width: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center', borderColor: addOnSelected.some((vale) => vale.id == val.id) ? Colors.main : '#575757', backgroundColor: addOnSelected.some((vale) => vale.id == val.id) ? Colors.main : '#fff', borderWidth: 1 }}>
                               {addOnSelected.some((vale) => vale.id == val.id) && <Feather name='check' color='#fff' size={14} style={{}} />}
                            </TouchableOpacity>
                        </View>
                    </Row>
                    
                    </>
                )}
            </View>}
            <View style={{ height: 0.5, marginTop: 12, marginBottom: 24, backgroundColor: '#7C7C7C', marginHorizontal: -14 }} />
              <Row style={{ marginBottom: 24 }}>
                  <Text size={16} type='bold'>Total Harga</Text>
                  <Col>
                      <Text size={16} textAlign='right' type='bold'>{FormatMoney.getFormattedMoney(this.total(), 'Rp')}</Text>
                  </Col>
              </Row>
              <TouchableOpacity onPress={() => this.toggleModal()} style={{ backgroundColor: Colors.main, marginBottom: 20, paddingVertical: 14, borderRadius: 4, alignItems: 'center' }}>
                  <Text size={14} type="bold" style={{ color: '#fff' }}>Daftar Pelatihan</Text>
              </TouchableOpacity>
          </View>
        </TouchableOpacity>
        </Wrapper>
      </Modal>);

  }
}