// Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Image} from 'react-native';
import GlobalStyles from '@/styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';




const Header: React.FC = () => {
  return (
    <View style={[GlobalStyles.row, styles.header]}>
      <TouchableOpacity>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Image source={require('../app/assets/images/Food.png')} style={styles.image} />
      
      <TouchableOpacity style={styles.cartIcon}>
      <Ionicons
        name="cart-outline"
        size={30}
        color="#FF7622"/>
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
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    resizeMode: "contain", // Ensures the image maintains its aspect ratio
  },
});

export default Header;

