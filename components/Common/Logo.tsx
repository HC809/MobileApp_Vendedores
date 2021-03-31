import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../../assets/LaRocaLogo.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 70,
    marginBottom: 15,
    marginTop: 70
  },
});

export default memo(Logo);