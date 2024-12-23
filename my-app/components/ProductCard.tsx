// ProductCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ProductCardProps {
  title: string;
  rating: number;
  time: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, rating, time, imageUrl }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.details}>
        <Text style={styles.rating}>⭐ {rating}</Text>
        <Text style={styles.time}>⏱️ {time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: 120,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#FFCC00',
  },
  time: {
    fontSize: 12,
    color: '#333',
  },
});

export default ProductCard;