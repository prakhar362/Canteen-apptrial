import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryCardProps {
  title: string;
  active?: boolean;
  onPress: () => void; // Add onPress handler
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, active ? styles.activeCard : styles.inactiveCard]}
      onPress={onPress} // Handle category change on press
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
