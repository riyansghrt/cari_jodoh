import React from 'react';
import Styled from 'styled-components';
import { View, ActivityIndicator, TouchableOpacity, Modal, Platform } from 'react-native';
import { Colors } from './Colors';
import Text from './Text';


const Wrapper = Styled(View)`
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 15px;
  `;

const Body = Styled(View)`
    background-color: #fff;
    padding: 35px;
    border-radius: 5px;
    minWidth: 1px;
  `;

const ContainerIndicator = Styled(View)`
  `;

const BodyText = Styled(View)`
    width: 100%;
    justify-content: center;
  `;

const MessageText = Styled(Text)`
    textAlign: center;
  `;

export default class ModalUpdate extends React.Component {

  render() {
    const { onClose, visible, count, message, type, data, transparent } = this.props;
    const mandatory = Platform.OS == 'ios' ? data.is_mandatory_ios : data.is_mandatory_ios;
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {}}>
            <Wrapper {...this.props}>
              <Body type={type} transparent={transparent}>
                <BodyText>
                  <MessageText>Update baru tersedia!</MessageText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                      {!mandatory && <TouchableOpacity onPress={() => this.props.onClose()} activeOpacity={0.8} style={{ backgroundColor: Colors.main, marginTop: 15, width: '40%', borderRadius: 8 }}>
                          <Text style={{ color: '#fff', textAlign: 'center', paddingVertical: 10 }}>Nanti</Text>
                      </TouchableOpacity>}
                      <TouchableOpacity onPress={() => this.props.onSubmit()} activeOpacity={0.8} style={{ backgroundColor: Colors.main, marginTop: 15, width: data.mandatory ? '80%' : '40%', borderRadius: 8 }}>
                        <Text type='semiBold' style={{ color: '#fff', textAlign: 'center', paddingVertical: 10 }}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </BodyText>
              </Body>
            </Wrapper>
        </Modal>);

  }
}