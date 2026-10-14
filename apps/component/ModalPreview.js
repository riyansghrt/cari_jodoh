import React from 'react';
import Styled from 'styled-components';
import { View, TouchableOpacity, Dimensions, Modal, Image, Text, ActivityIndicator } from 'react-native';

let { width, height } = Dimensions.get('window');

const Wrapper = Styled(TouchableOpacity)`
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    justify-content: center;
    align-items: center;
  `;

const Body = Styled(View)`
    background-color: ${(props) => props.transparent ? 'transparent' : 'transparent'};
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    minWidth: 1px
  `;

const ContainerIndicator = Styled(View)`
  `;

const BodyText = Styled(View)`
    width: 100%
    margin-top: 15px;
    justify-content: center;
  `;

const MessageText = Styled(Text)`
    textAlign: center;
  `;

export default class ModalPreview extends React.Component {

  render() {
    const { onClose, visible, count, data, message, type, transparent } = this.props;
    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose() : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose()} {...this.props}>
              <Body type={type} transparent={transparent}>
                <ContainerIndicator>
                    <Image resizeMode='contain' style={{ height: height, width: width }} source={{ uri: this.props.data }} />
                </ContainerIndicator>
                {message && <BodyText>
                </BodyText>}
              </Body>
            </Wrapper>
        </Modal>);

  }
}