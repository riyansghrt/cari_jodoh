import React from 'react';
import Styled from 'styled-components';
import Text from '../component/Text';
import Button from '../component/Button';
import { View, TouchableOpacity, Dimensions, Modal, Image, ActivityIndicator } from 'react-native';

let { width, height } = Dimensions.get('window');

const Wrapper = Styled(TouchableOpacity)`
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    align-items: flex-end;
    justify-content: flex-end;
  `;

const Body = Styled(View)`
    background-color: ${(props) => props.transparent ? 'transparent' : 'transparent'};
    
    border-radius: 5px;
    minWidth: 1px
  `;

const ContainerIndicator = Styled(View)`
    borderColor: #E0E0E0
    borderWidth: 1px
    borderRadius: 6px
    padding: 15px
    backgroundColor: #fff
  `;

const BodyText = Styled(View)`
    width: 100%
    margin-top: 15px;
    justify-content: center;
  `;

const MessageText = Styled(Text)`
  `;

export default class ModalSyaratKetentuan extends React.Component {

  render() {
    const tt = "Candy macaroon cookie pastry jujubes. Halvah bear claw dessert biscuit jelly-o. Jelly beans liquorice cookie soufflé pastry chupa chups oat cake liquorice. Gummies danish gummies sweet roll fruitcake sugar plum sweet. Apple pie cake sweet chocolate bar muffin shortbread. Bonbon biscuit bear claw jelly beans sweet chocolate bar jelly tart. Bear claw soufflé sweet roll oat cake chocolate brownie.";
    const { onClose, visible, count, data, message, type, transparent } = this.props;
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
              <Body type={type} transparent={transparent}>
                <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', padding: 15 }}>
                    <TouchableOpacity onPress={() => this.props.onClose()} style={{ height: 5, width: 55, backgroundColor: '#C4C4C4', alignSelf: 'center', marginBottom: 15 }} />
                    <Text textAlign='center' type='semiBold' size={16}>Tetap lanjutkan laporan anda?</Text>
                    <Text style={{ marginBottom: 8, marginTop: 17 }} type='semiBold'>Syarat dan Ketentuan</Text>
                    <ContainerIndicator>
                        <MessageText size={10}>{tt}</MessageText>
                    </ContainerIndicator>
                    <Button label='Publish' onPress={() => this.props.onClose()} style={{ marginVertical: 15, borderRadius: 20 }} />
                </TouchableOpacity>
                
              </Body>
            </Wrapper>
        </Modal>);

  }
}