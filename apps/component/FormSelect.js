import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Text from './Text'
import Styled from 'styled-components';
import { StyleSheet } from 'react-native';
import { Col, Row } from './Grid';
import ModalPreview from './ModalPreview';

const Btn = Styled(TouchableOpacity)`
  borderRadius: 8px
  alignItems: center
  backgroundColor: #0F52BA
`;


const ButtonBorder = Styled(TouchableOpacity)`
    borderRadius: 8px
    borderColor: #e5e5e5
    borderWidth: 1px
    paddingVertical: 12px
`;

const WhiteText = Styled(Text)`
    color: #fff
    fontSize: 12px
`;

const bluePrimaryStyle = {
  backgroundColor: '#2E4DC4', elevation: 1, borderRadius: 10, marginBottom: 15, paddingVertical: 12
}
let canRequest = true

class FormSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPreview: null
        };
    }

    onClick(){
        if(canRequest){
          canRequest = false
          this.props.onPress()
        }
        setTimeout(() => {
          canRequest = true
        }, 2000);
      }

    render() {
        const { children, gradient, border, icon, label, color, bluePrimary, value,  ...style} = this.props;
        return (
          <>
           <Text style={{ marginBottom: 4, }} >{label}</Text>
            <Row>
                <Col>
                    <TouchableOpacity activeOpacity={0.9} onPress={() =>  this.setState({ dataPreview: value ? value.path : null })} style={styles.ImageView} >
                        <Text textAlign='center' style={{ paddingHorizontal: 10 }}>{value ? 'Klik disini untuk melihat gambar' : 'Klik Ubah untuk pilih gambar'}</Text>
                    </TouchableOpacity>
                </Col>
                <Col size={3}>
                    <TouchableOpacity  activeOpacity={0.8} onPress={() => this.onClick()}  style={{ backgroundColor: '#990012', alignItems: 'center', borderRadius: 6, paddingVertical: 16 }}>
                        <Row>
                            <Text color='#fff' type='bold'>Ubah</Text>
                            <Image source={require('../../assets/icon/edit.png')} resizeMode='contain' style={{ height: 20, width: 20 }}  />
                        </Row>
                    </TouchableOpacity>
                </Col>
            </Row>
            

            {this.state.dataPreview && <ModalPreview 
                visible={this.state.dataPreview ? true : false}
                data={this.state.dataPreview}
                onClose={() => this.setState({ dataPreview: null })}
                onUpdate={this.onImage}
            />}
          </>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFF',
    },
    ImageView: {
        borderWidth: 1, 
        marginBottom: 15, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderColor: '#990012', 
        borderRadius: 8, 
        marginRight: 4,
        paddingVertical: 16
    },
})

export default FormSelect;
