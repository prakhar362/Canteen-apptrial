import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder: string;
  onSearch: (text: string) => void; // Callback to handle search term change
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#999"
        onChangeText={onSearch} // Call onSearch to update search term
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default SearchBar;
