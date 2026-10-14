
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { View, Image } from 'react-native';

class IconWithBadge extends React.Component {
  render() {
    const { name, color, size } = this.props;
    const Images = {
      Home: <Image resizeMode='contain' source={color == '#990012' ? require('../assets/tab/homesolid.png') : require('../assets/tab/homestroke.png')} style={{ width: 25, height: 25, }} />,
      Job: <Image resizeMode='contain' source={color == '#990012' ? require('../assets/tab/feedsolid.png') : require('../assets/tab/feedstroke.png')} style={{ width: 25, height: 25, }} />,
      Pelatihan: <Image resizeMode='contain' source={color == '#990012' ? require('../assets/tab/newssolid.png') : require('../assets/tab/newsstroke.png')} style={{ width: 25, height: 25, }} />,
      Bookmark: <Image resizeMode='contain' source={color == '#990012' ? require('../assets/tab/servicesolid.png') : require('../assets/tab/servicestroke.png')} style={{ width: 25, height: 25, }} />,
      Account: <Image resizeMode='contain' source={color == '#990012' ? require('../assets/tab/usersolid.png') : require('../assets/tab/userstroke.png')} style={{ width: 25, height: 25, }} />,
      Lowongan: <Image resizeMode='contain' source={color == '#990012' ? require('../assets/tab/usersolid.png') : require('../assets/tab/userstroke.png')} style={{ width: 25, height: 25, }} />,
    }
    return (
      <View style={{ width: 70, justifyContent: 'center', alignItems: 'center', height: 40, marginTop: 5, }}>
        {Images[name]}
        {/* <Text size={10} color={color} type='semiBold'>{name}</Text> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(IconWithBadge);