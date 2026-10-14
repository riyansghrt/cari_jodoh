import React from 'react';
import Styled from 'styled-components';
import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Dimensions, Picker, Platform, StyleSheet, Image } from 'react-native';
import Text from './Text';
import { Col, Row } from './Grid';
import FormatType from './FormatType';
import Antd from 'react-native-vector-icons/AntDesign';


const { width, height } = Dimensions.get('window');

const Wrapper = Styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.6);
  justifyContent: center;
  flex: 1;
  `;

const Body = Styled(View)`
    background-color: ${(props) => props.transparent ? 'transparent' : 'transparent'};
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    minWidth: 1px
  `;

export default class PopUpHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0
    };
  }

  onClick = () => {
    this.props.onClose(null);
    const { user } = this.props;
    const { data } = this?.props;
    if (user) {
      if (data?.app_link) {
        if (data?.app_link == 'GenerateCvNotif') {
          if (!user.has_subscription) {
            setTimeout(() => {
              this.props.navigation.navigate(data.app_link);
            }, 1000);
          }
        } else {
          this.props.navigation.navigate(data.app_link);
        }
      }

    }

  };

  render() {
    const { onClose, visible, count, message, type, ukuranBarang, data, transparent, color, uri } = this.props;

    return (
      <Modal transparent animationType='fade' visible={visible} onRequestClose={() => {onClose ? this.props.onClose(this.props.index + 1) : undefined;}}>
            <Wrapper activeOpacity={1} onPress={() => this.props.onClose(this.props.index + 1)} {...this.props}>
              {/* <Row> */}
              <View style={{ position: 'relative' }}>
                <TouchableOpacity
              onPress={() => onClose(this.props.index + 1)}
              style={{
                position: 'absolute',
                top: 10,
                right: 40,
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 6,
                zIndex: 10
              }}>

                  <Antd name="close" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.onClick(null)} style={{ overflow: 'hidden' }}>
                    <Image source={{ uri: data.app_path }} resizeMode='contain' style={{ height: width + 50, width: width }} />
                </TouchableOpacity>
                </View>
                {/* </Row> */}
                
            </Wrapper>
        </Modal>);

  }
}