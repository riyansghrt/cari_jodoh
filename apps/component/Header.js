import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Platform,StatusBar,SafeAreaView } from 'react-native';
import Styled from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/Entypo';
import Entypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import { Row, Col } from './Grid';
import Text from './Text'

const MainView = Styled(View)`
    width: 100%;
    paddingTop: ${Platform.OS == 'ios' ? 0 : 0};
    height: ${Platform.OS == 'ios' ? 60+'px' : 60+'px'};
`;

const TransparentMainView = Styled(MainView)`
    backgroundColor: transparent;
    height: ${Platform.OS == 'ios' ? 60 : 60};
`;

const RowView = Styled(Row)`
    height: 100%;
`;

const ColumnView = Styled(Col)`
    justifyContent: center;
    alignItems: center;
`;

const TransparentBackView = Styled(View)`
    width: 100%;
    minHeight: 30px;
    width: 30px
    elevation: 2;
    borderRadius: 20px;
    justifyContent: center;
    alignItems: center;
    backgroundColor: #FFFFFF;
`;

const SideButton = Styled(TouchableOpacity)`
    flex: 1;
    width: 100%;
    alignItems: center;
    justifyContent: center;
`;

const SideIcon = Styled(Icon)`
    fontSize: 23;
`;

const SideIconIos = Styled(FontAwesome)`
    fontSize: 20;
`;

const SideIconRight = Styled(SideIcon)`
    fontSize: 14;
`;

const TitleText = Styled(Text)`
    fontSize: 16;
`;

const defaultProps = {
    color: '#fff',
    showLeftButton: false,
    iconLeftButton: 'arrow-back',
};

class Header extends React.Component {

  onPressRightButton = () => {
    if (this.props.onPressRightButton) this.props.onPressRightButton();
  }

  onPressLeftButton = () => {
    if (this.props.onPressLeftButton) this.props.onPressLeftButton();
    else this.props.navigation.pop();
  }

  renderTransparentMode() {
    const { showLeftButton, iconLeftButton, iconRightButton, children, ...style } = this.props;
    return (
      <TransparentMainView {...style}>
        <RowView style={{ justifyContent: 'center' }}>
          <Col size={2} style={{  height: 60 }}>
            {showLeftButton ? 
                <SideButton onPress={this.onPressLeftButton} >
                    <TransparentBackView>
                        <SideIcon name={iconLeftButton} color='#333' />
                    </TransparentBackView> 
                </SideButton>
           : <View />}
          </Col>

          <ColumnView size={8}>
            {children || <View />}
          </ColumnView>

          <ColumnView size={2}>
            {iconRightButton ? <SideButton onPress={this.onPressRightButton}>
              {iconRightButton}
            </SideButton> : <View />}
          </ColumnView>

        </RowView>
      </TransparentMainView>
    );
  }

  renderNormalMode() {
    const { showLeftButton, budge, root,iconLeftButtons, rootHeader, iconLeftButton, iconRightButton, titleRight, iconRightButtons, color, title, children, ...style } = this.props;
    return (
      <>
       {/* {Platform.OS == 'ios' && <View style={{ height: StatusBar.currentHeight, backgroundColor: '#990012' }}>
            <SafeAreaView>
                <StatusBar translucent backgroundColor={'#990012'} barStyle="light-content" />
            </SafeAreaView>
        </View>}    */}
      <MainView  {...style} {...this.props}>
       
        <RowView>
          <ColumnView size={1.5} style={{ alignItems: 'flex-start', height: '100%', justifyContent: 'center' }}>
            {showLeftButton ? <SideButton onPress={this.onPressLeftButton} style={{ alignItems: 'flex-start', paddingLeft: 20 }}>
                <SideIconIos name={'chevron-left'} color={color} />
            </SideButton> : <View />}
            {iconLeftButtons ? <SideButton onPress={this.onPressLeftButton} style={{ alignItems: 'flex-end' }}>
              <Image source={iconLeftButtons} style={{ height: 16, width: 16, marginRight: 20 }} resizeMode='stretch' />
            </SideButton> : <View />}
          </ColumnView>
         
          <ColumnView size={8} style={{ alignItems: 'flex-start' }}>
            {children || <TitleText onPress={this.onPressLeftButton} type='semiBold' textAlign='left' size={20} color={color} >{title}</TitleText>}
          </ColumnView>

          <ColumnView size={2} style={{ alignItems: 'flex-end', paddingRight: 0 }}>
            {iconRightButton ? <SideButton onPress={this.onPressRightButton} style={{ alignItems: 'flex-end' }}>
              <Image source={iconRightButton} style={{ height: 20, width: 20, marginRight: 20 }} resizeMode='stretch' />
            </SideButton> : <View />}
            {titleRight && <TouchableOpacity onPress={this.onPressRightButton} style={{ justifyContent: 'center', alignItems: 'flex-end' }} >
              {titleRight}
            {/* {iconRightButtons && <IconFeather name={iconRightButtons} size={20} color='#AFB9B9' />} */}
            {budge === false && <View style={{ position: 'absolute', right: 0, backgroundColor: 'rgba(253, 131, 84, 1)', height: 8, width: 8,borderRadius: 4 }}/>}
            </TouchableOpacity>}
          </ColumnView>

        </RowView>
      </MainView>
      </>
    );
  }

  renderHeaderMode() {
    const { showLeftButton, budge, root, iconRightButtontwo,rootHeader, iconLeftButton, iconRightButton, titleRight, iconRightButtons, color, title, children, ...style } = this.props;
    return (
      <MainView {...style} {...this.props} style={{ paddingHorizontal: 15, backgroundColor: '#990012'}}>
        <RowView>
          <ColumnView size={6} style={{alignItems: 'flex-start'  }}>
            {children || <TitleText type='bold' style={{ color: '#fff' }}>{title}</TitleText>}
          </ColumnView>

          <ColumnView size={6} style={{ alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
            {iconRightButton ? <View style={{ alignItems: 'flex-end' }}>
              <Row>
              {iconRightButton&& <TouchableOpacity  style={{ justifyContent: 'center' }} onPress={() => this.onPressRightButton()}>
                {iconRightButton}
               </TouchableOpacity>}
              {iconRightButtontwo && <TouchableOpacity  style={{ justifyContent: 'center' }} onPress={() => this.props.onPressRightButtonTwo()}>
                {iconRightButtontwo}
              </TouchableOpacity>}

              </Row>
            
            </View> : <View />}
            {titleRight && <TouchableOpacity onPress={this.onPressRightButton}>{titleRight}
            <IconFeather name={iconRightButtons} size={20} color='#AFB9B9' />
            {budge === false && <View style={{ position: 'absolute', right: 0, backgroundColor: 'rgba(253, 131, 84, 1)', height: 8, width: 8,borderRadius: 4 }}/>}
            </TouchableOpacity>}
          </ColumnView>

        </RowView>
      </MainView>
    );
  }

  render() {
    const { transparentMode, header } = this.props;
    if (transparentMode) return this.renderTransparentMode();
    else if(header) return this.renderHeaderMode()
    return this.renderNormalMode();
  }
}

Header.defaultProps = defaultProps;

export default Header
