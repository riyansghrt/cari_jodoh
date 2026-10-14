import React, { Component } from 'react';
import { Text as ReactText, Platform } from 'react-native';
import Styled from 'styled-components';
import { connect } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../state/lang/UseLanguage';



const BaseText = Styled(ReactText)`
  fontSize: ${props => (props.size ? props.size+'px' : 12+'px')};
  fontFamily: ${props => (props.type === 'bold' ? 'Onest-Bold' : (props.type === 'semiBold') ? 'Onest-SemiBold' : (props.type === 'extra') ? 'Onest-ExtraBold' : (props.type === 'medium') ? 'Onest-Medium' : Platform.OS == 'ios' ? 'Onest-Regular' : 'Onest-Regular')};
  fontStyle: ${props => (props.fontStyle ? props.fontStyle : 'normal')};
  color: ${props => (props.color ? props.color : '#09051C')};
  textAlign: ${props => (props.textAlign ? props.textAlign : 'left')};
  textDecorationLine: ${props => (props.textDecorationLine ? props.textDecorationLine : 'none')};
`;


class Text extends Component {

    render() {
        const { children, uper, ...style } = this.props;
        const {language} = this.props.language
        return (
            <BaseText {...style} {...this.props} allowFontScaling={false}>
              {uper ? t(language, children)?.toUpperCase() : t(language, children)}
            </BaseText>
        );
    }
}


const mapStateToProps = (state) => ({
  user: state["user"],
  language: state["language"],
});


export default connect(mapStateToProps)(Text);
