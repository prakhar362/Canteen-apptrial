import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, FoodItem } from '../navigation/AppNavigator';

import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import GlobalStyles from '@/styles/GlobalStyles';
import SearchBar from '@/components/SearchBar';
import Sidebar from '@/components/Sidebar';
import OrderTrackingBubble from '@/components/OrderTrackingBubble'; // Import the tracking bubble

const HomeScreen: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fetch food items from the backend
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch('https://canteen-web-1.onrender.com/app/api/v1/fooditem', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch food items');
        }

        const data = await response.json();
        if (data.success) {
          setFoodItems(data.data); // Set fetched food items
          setFilteredFoodItems(data.data); // Initialize filtered items
        } else {
          Alert.alert('Error', 'Unable to fetch food items');
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
        Alert.alert('Error', 'An error occurred while fetching food items.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Filter food items based on category and search term
  useEffect(() => {
    const filtered = foodItems.filter((item: FoodItem) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredFoodItems(filtered);
  }, [selectedCategory, searchTerm, foodItems]);

  const handleFoodItemPress = (item: FoodItem) => {
    navigation.navigate('FoodItemDetails', { foodItem: item });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  if (loading) {
    return (
      <View style={[GlobalStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading food items...</Text>
      </View>
    );
  }

  // Dynamically generate categories from food items
  const categories = Array.from(new Set(foodItems.map((item) => item.category)));

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <ScrollView
        style={GlobalStyles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Search Bar */}
        <SearchBar
          placeholder="Search dishes, Cuisines"
          onSearch={setSearchTerm}
        />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <CategoryCard
            title="All"
            active={selectedCategory === 'All'}
            onPress={() => setSelectedCategory('All')}
          />
          {categories.map((category) => (
            <CategoryCard
              key={category}
              title={category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>

        {/* Food List */}
        <View style={styles.foodGrid}>
          {filteredFoodItems.map((item: FoodItem) => (
            <ProductCard
              key={item._id}
              title={item.name}
              rating={item.rating}
              time={item.time}
              imageUrl={item.img}
              onPress={() => handleFoodItemPress(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Order Tracking Bubble at the Bottom */}
      <View style={styles.bubbleWrapper}>
        <OrderTrackingBubble timeRemaining={12} status="Preparing your order" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleWrapper: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '90%',
  },
});

export default HomeScreen;
