import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import GlobalStyles from '@/styles/GlobalStyles';
import SearchBar from '../../components/SearchBar';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={GlobalStyles.container}>
      {/* Header */}
      <Header />

 {/* Search Bar */}
      <SearchBar placeholder="Search dishes, Cuisines" />

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <CategoryCard title="All" active />
        <CategoryCard title="Chinese" />
        <CategoryCard title="South Indian" />
      </View>

      {/* Food List */}
      <View style={styles.foodGrid}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <ProductCard 
              key={index}
              title="Veg Haka Noodles"
              rating={4.7}
              time="20 min"
              imageUrl="https://via.placeholder.com/150"
            />
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: 'row',   
    marginBottom: 16,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
