import React, { Component } from 'react';
import { View } from 'react-native'
import Styled from 'styled-components';

const Container = Styled(View)`
    flexDirection: row;
    flexWrap: wrap;
`

class Row extends Component {
    render() {
        return (
            <Container {...this.props}>
                {this.props.children}
            </Container>
        )
    }
}


export default Row;