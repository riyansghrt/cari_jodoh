import React, {Component} from 'react';
import Styled from 'styled-components';
import Text from './Text';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, ToastAndroid, Image, TextInput, Platform, ActivityIndicator, Modal } from 'react-native';
import { Row } from './Grid';

const BaseText = Styled(Text)`
	color: #ff9900;
`;
const ContentView = Styled(View)`
    marginBottom: 10px;
`;

const LabelContent = Styled(View)`
    justifyContent: center;
    paddingHorizontal: 3px;
    position: absolute;
    top: -10;
    marginLeft: 10px;
    minWidth: 2px;
    backgroundColor: #fff;

`;

const LeftContent = Styled(View)`
	width: 100%;
    width: 100%;
    flexDirection: row;
    borderColor: ${props => (props.error ? 'red' : '#575757')};
    backgroundColor: #fff;
    borderWidth: 1px;
    borderRadius: 8px;
    justifyCenter: center;
`;

const StyledInput = Styled(TextInput)`
    fontSize: 14px;
    paddingBottom: ${Platform.OS === 'ios' ? 5+'px' : 0+'px'};
    marginTop: 0px;
    color: #111;
    paddingLeft: 10px;
    paddingTop: 12px;
    paddingBottom: 12px;
`

class InputText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false
        };
      }

    onChangeText = (value) => {
        const { name } = this.props;
        this.props.onChangeValue(name, value);
    }

    onBlur = () => {
        const { name } = this.props;
        if (this.props.onBlurValue !== undefined) {

            if (this.props.id !== undefined) {
                this.props.onBlurValue(name, this.props.id);
            } else {
              this.props.onBlurValue(name);
            }
        }
    }

    onFocusChange = () => {
        this.setState({ isFocused: true });
    }

  render() {
        const { name, label, error,wa, styleC, style, disabled, required, ...restProps } = this.props;
        const isMultiline = !!this.props.multiline;
        const inputWrapperStyle = {
            width: isMultiline ? '100%' : (wa ? '100%' : '85%'),
        };
        const inputStyle = {
            ...(isMultiline ? { minHeight: 96, textAlignVertical: 'top' } : null),
        };
    if(this.props.editable == false){
        return (
            <ContentView>
            {label && <Row>
                <Text type='semiBold' color='#111' style={{ marginBottom: 4 }}>{label}</Text>
                {required ? <Text color='red'>*</Text> : ''}
            </Row>}
            <LeftContent  error={error} style={{ flexDirection: 'column', backgroundColor: disabled ? '#EDEDED' : '#fff' }}>
                <View style={{ paddingVertical: 12, paddingLeft: 10 }}>
                    {this.props.value ? <Text>{this.props.value ? this.props.value : ' ' }</Text>
                    :
                    <Text color='#bcbcbc'>{this.props.placeholder ? this.props.placeholder : ' ' }</Text>}
                </View>
            </LeftContent>
            { error &&
                        <Text color='red'>
                            {error}
                        </Text>
                    }
            </ContentView>
        )
    }
    return (
        <ContentView>
        {label && <Row>
                <Text type='semiBold' color='#111' style={{ marginBottom: 4 }}>{label}</Text>
                {required ? <Text color='red'>*</Text> : ''}
            </Row>}
            <View>
                {(name === 'password' || name === 'password_confirmation' || name === 'passwordConfirmation' || name === 'oldPassword' || name === 'confirmPassword') ? <LeftContent>
                        <View style={{ width: '90%' }}>
                        <StyledInput
                            onChangeText={(text) => this.onChangeText(text)}
                            underlineColorAndroid="transparent"
                            onFocus={this.onFocusChange}
                            placeholderTextColor='#bcbcbc'
                            onBlur={this.onBlur}
                            autoCorrect={false}
                            {...this.props}
                        />
                        </View>
                        
                        <TouchableOpacity onPress={() => this.props.onVisible(!this.props.secureText)} style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{this.props.secureTextEntry ? <Icon name='eye-off' color='#bcbcbc' size={18} /> : <Icon name='eye' size={18} color='#bcbcbc' />} </Text>
                        </TouchableOpacity>
                        {/* { this.state.isFocused &&<LabelContent>
                            <BaseText>{label}</BaseText>
                        </LabelContent>} */}
                    </LeftContent>
                :
                <LeftContent
                    style={[
                        styleC,
                        isMultiline && { alignItems: 'flex-start' },
                    ]}
                    error={error}
                >
                    <View style={inputWrapperStyle}>
                        <StyledInput
                            onChangeText={(text) => this.onChangeText(text)}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#bcbcbc'
                            onFocus={this.onFocusChange}
                            onBlur={this.onBlur}
                            autoCorrect={false}
                            style={[style, inputStyle]}
                            {...restProps}
                        />
                    </View>
                    {wa && <View onPress={() => this.props.onVisible(this.props.secureText)} style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='logo-whatsapp' color='#990012' size={18} />
                    </View>}
                </LeftContent>
                }
                { error &&
                        <Text color='red'>
                            {error}
                        </Text>
                    }
            </View>
        </ContentView>
    );
  }
}

export default InputText;
