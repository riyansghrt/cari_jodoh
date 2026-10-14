import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.number,
    align: PropTypes.string
}

const defaultProps = {
    size: 0,
}

const ContainerCol = Styled(View)`
    flex: 0 0 auto;
    ${props => props.size !== 0 ? `
        flex-basis: ${100 / 12 * props.size}%;
        max-width: ${100 / 12 * props.size}%;
    `
    : `
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
    `
    }
    width: 100%;
    min-height: 1px;
    ${props => props.align && `
        alignItems: ${props.align};
    `}
`

class Col extends Component {
    render() {
        return (
            <ContainerCol
                {...this.props}
            >
                {this.props.children}
            </ContainerCol>
        )
    }
}

Col.propTypes = propTypes;
Col.defaultProps = defaultProps;


export default Col;