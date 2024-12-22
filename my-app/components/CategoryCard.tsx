// CategoryCard.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryCardProps {
  title: string;
  active?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, active }) => {
  return (
    <TouchableOpacity
      style={[styles.card, active ? styles.activeCard : styles.inactiveCard]}
    >
      <Text style={active ? styles.activeText : styles.inactiveText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeCard: {
    backgroundColor: '#FF7622',
  },
  inactiveCard: {
    backgroundColor: '#F0F0F0',
  },
  activeText: {
    color: '#fff',
    fontSize: 14,
  },
  inactiveText: {
    color: '#333',
    fontSize: 14,
  },
});

export default CategoryCard;