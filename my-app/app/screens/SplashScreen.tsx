import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Fullscreen background image */}
      <Image
        style={styles.backgroundImage}
        source={require('../assets/images/Bg.png')} // Ensure the path is correct
        resizeMode="cover" // Cover the entire screen
      />
      
      {/* Other content, such as logos */}
      <Image
        style={[styles.image, { marginBottom: 16 }]}
        source={require('../assets/images/veslogo.png')}
        resizeMode="contain"
      />
      <Image
        style={styles.image}
        source={require('../assets/images/logo.png')}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Optional fallback color
  },
  backgroundImage: {
    position: 'absolute', // Ensures the background covers the screen
    bottom: 0, // Aligns the image to the bottom of the screen
    right: 0, // Aligns the image to the right
    width: '100%', // Increases width to ensure bottom-right part is visible
    height: '100%', // Increases height for better control of positioning
  },
  image: {
    width: 190,
    height: 98,
    borderRadius: 8,
  },
});

export default SplashScreen;
