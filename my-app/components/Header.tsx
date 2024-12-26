// Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Image} from 'react-native';
import GlobalStyles from '@/styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';




const Header: React.FC = () => {
  return (
    <View style={[GlobalStyles.row, styles.header]}>
      <TouchableOpacity>
      <Image source={require('../app/assets/images/sidebar2.png')} style={styles.image2} />
      </TouchableOpacity>
      <Image source={require('../app/assets/images/Food.png')} style={styles.image} />
      
      <TouchableOpacity style={styles.cartIcon}>
      <Image source={require('../app/assets/images/Carticon.png')} style={styles.image3} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuIcon: {
    fontSize: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6600',
  },
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF0000',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    fontSize: 12,
  },
  image: {
    width: 100, // Adjust width as needed
    height: 50, // Adjust height as needed
    resizeMode: "contain", // Ensures the image maintains its aspect ratio
  },
  image2: {
    width: 50, // Adjust width as needed
    height: 50, // Adjust height as needed
    marginLeft:-2, // Ensures the image maintains its aspect ratio
  },
  image3: {
    width: 40, // Adjust width as needed
    height: 40, // Adjust height as needed
    marginRight:-2, // Ensures the image maintains its aspect ratio
  },
});

export default Header;

