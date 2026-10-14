import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from './Text'
import Styled from 'styled-components';

const Btn = Styled(TouchableOpacity)`
  borderRadius: 4px;
  alignItems: center;
  backgroundColor: #00906C;
  paddingVertical: 14px;
`;


const ButtonBorder = Styled(TouchableOpacity)`
    borderRadius: 4px;
    borderColor: #00906C;
    borderWidth: 1px;
    alignItems: center;
    paddingVertical: 12px;
`;

const WhiteText = Styled(Text)`
    color: #fff;
    fontSize: 12px;
`;

const bluePrimaryStyle = {
  backgroundColor: '#2E4DC4', elevation: 1, borderRadius: 10, marginBottom: 15, paddingVertical: 12
}

class Button extends Component {
    render() {
        const { children, gradient, border,size, icon, label, color,type, bluePrimary, ...style } = this.props;
        return (
          <>
            {border ? 
                <ButtonBorder onPress={this.props.onPress} {...style}  activeOpacity={0.8} >
                    {icon && <View style={{ justifyContent: 'center' }}>
                        {icon}
                    </View>}
                    <Text size={size ? size : 12} style={{ textAlign: 'center'}} color={color ? color : '#111'} type={type ? type : 'regular'}>{label}</Text>
                    
                </ButtonBorder>
            : bluePrimary ? 
            <TouchableOpacity onPress={this.props.onPress} style={bluePrimaryStyle} {...style}  activeOpacity={0.8} >
                <Text size={size ? size : 12}  style={{ textAlign: 'center', color: '#fff' }}>{label}</Text>
            </TouchableOpacity>
            :
            <Btn activeOpacity={0.8} onPress={this.props.onPress} {...style} {...this.props}>
              {icon && <View style={{ justifyContent: 'center' }}>
                  {icon}
              </View>}
              {children ? children :
              <Text color='#fff' size={size ? size : 14} type={type ? type : 'semiBold'}>{label}</Text>}
              
            </Btn>}
          </>
        );
    }
}

export default Button;
