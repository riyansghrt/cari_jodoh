import React from 'react';
import Styled from 'styled-components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, ActivityIndicator, Image, Dimensions, TouchableOpacity, Modal, Text } from 'react-native';


const { width } = Dimensions.get('window');
const Wrapper = Styled(TouchableOpacity)`
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 15px;
  `;

const Body = Styled(TouchableOpacity)`
    background-color: ${(props) => props.transparent ? 'transparent' : 'transparent'};
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-radius: 5px;
    minWidth: 1px
  `;

const ContainerIndicator = Styled(View)`
    backgroundColor: #fff;
    padding: 0px 20px 20px 20px;
    borderRadius: 5px;
  `;

const BodyText = Styled(View)`
    width: 100%;
    margin-top: 15px;
    justify-content: center;
  `;

const MessageText = Styled(Text)`
    textAlign: center;
  `;

export default class Warning extends React.Component {

  render() {
    const { onClose, visible, count, message, type, transparent } = this.props;
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper onPress={() => this.props.onClose()} {...this.props}>
              <Body type={type} transparent={transparent}>
                <ContainerIndicator style={{ alignItems: 'center' }}>
                    <Image source={require('../../assets/icon/tenor.gif')} />
                   <Text style={{ color: 'red', fontSize: 25, fontWeight: 'bold' }}>KEADAAAN DARURAT!</Text>
                   <Text />
                   <Text style={{ fontSize: 16, textAlign: 'center' }}>Anda dekat dengan lokasi bencana Gempa Bumi dengan magnitudo 5,7 SR.</Text>
                   <Text style={{ fontSize: 16 }}>Segera evakuasi diri!</Text>
                   {/* <View style={{ position: 'absolute', right: 20, top: 20}}>
                    <MaterialCommunityIcons name='bell-outline' color='#030F25' size={25} />
                </View> */}
                    <TouchableOpacity onPress={() => {this.props.onClose();this.props.navigation.navigate('ReportScreen');}} activeOpacity={0.8} style={{ backgroundColor: '#990012', width: width - 60, elevation: 1, borderRadius: 4, marginVertical: 15, paddingVertical: 15 }}>
                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Lihat Detail</Text>
                    </TouchableOpacity>
                </ContainerIndicator>
                {message && <BodyText>
                  <MessageText>{message}</MessageText>
                </BodyText>}
              </Body>
            </Wrapper>
        </Modal>);

  }
}