import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import GlobalStyles from '@/styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../app/navigation/AppNavigator'; // Update with the correct path
import { useCart } from '../app/context/CartContext'; // Import the Cart context

interface HeaderProps {
  toggleSidebar: () => void; // Sidebar toggle function
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Navigation hook
  const { cartItems } = useCart(); // Get cart items from context

  const handleCartPress = () => {
    navigation.navigate('Cart'); // Navigate to cart page
  };

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0); // Calculate the total number of items

  return (
    <View style={[GlobalStyles.row, styles.header]}>
      {/* Sidebar Icon */}
      <TouchableOpacity onPress={toggleSidebar}>
        <Image source={require('../app/assets/images/sidebar2.png')} style={styles.image2} />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require('../app/assets/images/Food.png')} style={styles.image} />

      {/* Cart Icon */}
      <TouchableOpacity style={styles.cartContainer} onPress={handleCartPress}>
        <Ionicons name="cart" size={39} color="#000" />
        <View style={styles.cartBadge}>
          <Text style={styles.cartCount}>{cartItemCount}</Text> {/* Dynamic cart count */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  image2: {
    width: 48,
    height: 48,
    marginLeft: -2,
  },
  cartContainer: {
    position: 'relative',
    marginTop: 6,
    marginRight: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: 1,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default Header;
