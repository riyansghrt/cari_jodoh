import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class StarRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: props.initialRating || 0
    };
  }

  setRating = (rating) => {
    this.setState({ rating });
    if (this.props.onRatingChange) {
      this.props.onRatingChange(rating);
    }
  }

  renderStars = () => {
    const { rating } = this.state;
    const totalStars = this.props.totalStars || 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <TouchableOpacity disabled={this.props.disabled} key={i} onPress={() => this.setRating(i)}>
          <Icon
            name={i <= rating ? 'star' : 'star-o'}
            size={32}
            color={i <= rating ? '#FFD700' : '#CCC'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }

    return stars;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderStars()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  star: {
    marginHorizontal: 4
  }
});

export default StarRating;
