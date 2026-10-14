import React, { useContext, useState } from 'react';
import Styled from 'styled-components';
import { View, Modal, TouchableOpacity } from 'react-native';
import Text from './Text';
import Button from './Button';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { NavigationContext } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Colors } from './Colors';


const Wrapper = Styled(TouchableOpacity)`
    background-color: rgba(0, 0, 0, 0.4);
    flex: 1;
    justify-content: flex-end;
`;

const Body = Styled(View)`
    background-color: transparent
`;


  const ButtonMiddle = () =>  {

    const user = useSelector(state => state['user'].user);
    const [visible, setVisible] = useState(false);
    const navigation = useContext(NavigationContext);

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         visible:false,
    //     };
    // }

      return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => {
          if (user && navigation?.navigate) {
            navigation.navigate('AddReport', {type: 1});
            return;
          }

          setVisible(true);
        }} style={{ alignItems: 'center', backgroundColor: '#fff' }}>
            {/* <TouchableOpacity activeOpacity={0.9} onPress={() => user ? setVisible(true) : setVisibleLogin(true)} style={{ backgroundColor: '#0F52BA', marginTop: -32, height: 64, width: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}> */}
            <View  style={{ backgroundColor: '#990012', borderWidth: 1, borderColor: '#fff', marginTop: -32, height: 64, width: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}>
              
            </View>
            <Text color='#fff' size={11} type='bold'>Lapor</Text>
            {visible && <Modal transparent  animationType='fade' visible={visible} onRequestClose={() => {setVisible(false)}}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.4)' }} onPress={() => setVisible(false)}>
                        <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', paddingTop: 12, paddingBottom: 30, paddingHorizontal: 26, borderRadius: 4 }}>
                            <TouchableOpacity onPress={() => setVisible(false)} style={{ alignSelf: 'flex-end' }}>
                                <AntDesign name='close' size={20} />
                            </TouchableOpacity>
                            {/* <Image source={require('../../../assets/icon/mustLogin.png')} style={{ height: 156, width: 209, alignSelf: 'center', marginBottom: 8 }} resizeMode='cover'  /> */}
                            <Text type='bold' textAlign='center' size={16} color='#111' style={{ marginBottom: 12 }} >Anda Belum Masuk Ke Akun Anda</Text>
                            <Text size={12} style={{ marginBottom: 5 }} > Anda harus masuk ke akun anda terlebih dahulu untuk mengakses fitur-fitur lainnya.</Text>
                            {/* <Button onPress={() => {setVisible(false); this.props.navigation.navigate('Register')}} label='Daftar' border color={Colors.bluePrimary} style={{ width: '70%',alignSelf: 'center', borderColor: Colors.bluePrimary, borderRadius: 30, marginBottom: 12, marginTop: 20 }} /> */}
                            <Button onPress={() => {
                                setVisible(false);
                                navigation?.navigate?.('LoginScreen');
                            }} label='Masuk' style={{ width: '70%',alignSelf: 'center',borderRadius: 30,borderWidth: 1, borderColor: Colors.primary, margin: 20, }} />
                        </TouchableOpacity>
                    </View>
                    </Modal>}
        </TouchableOpacity>
      );
}

export default ButtonMiddle
