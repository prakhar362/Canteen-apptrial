// Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GlobalStyles from '@/styles/GlobalStyles';

const Header: React.FC = () => {
  return (
    <View style={[GlobalStyles.row, styles.header]}>
      <TouchableOpacity>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.logo}>Food</Text>
      <TouchableOpacity style={styles.cartIcon}>
        <Text style={styles.cartBadge}>2</Text>
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
});

export default Header;