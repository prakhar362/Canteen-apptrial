import React, { useState } from "react";
import { View, ScrollView, StyleSheet,Button} from "react-native";
// Home.tsx
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, FoodItem } from '../navigation/AppNavigator'; // Corrected import

import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import GlobalStyles from "@/styles/GlobalStyles";
import SearchBar from "@/components/SearchBar";
import foodItems from "@/data/foodItem";
import Sidebar from "@/components/Sidebar"; // Import Sidebar component

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State to manage sidebar visibility

  // Explicitly type the navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Filter food items based on category and search term
  const filteredFoodItems = foodItems.filter((item: FoodItem) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFoodItemPress = (item: FoodItem) => {
    navigation.navigate("FoodItemDetails", { foodItem: item }); // Correctly typed
  };

   // Function to toggle the sidebar
   const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

    <ScrollView style={GlobalStyles.container} keyboardShouldPersistTaps="handled">

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Search Bar */}
      <SearchBar
        placeholder="Search dishes, Cuisines"
        onSearch={setSearchTerm}
      />

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <CategoryCard
          title="All"
          active={selectedCategory === "All"}
          onPress={() => setSelectedCategory("All")}
        />
        <CategoryCard
          title="Chinese"
          active={selectedCategory === "Chinese"}
          onPress={() => setSelectedCategory("Chinese")}
        />
        <CategoryCard
          title="South Indian"
          active={selectedCategory === "South Indian"}
          onPress={() => setSelectedCategory("South Indian")}
        />
        <CategoryCard
          title="Indian"
          active={selectedCategory === "Indian"}
          onPress={() => setSelectedCategory("Indian")}
        />
        {/* Add more categories here */}
      </View>

      {/* Food List */}
      <View style={styles.foodGrid}>
        {filteredFoodItems.map((item: FoodItem) => (
          <ProductCard
            key={item.id}
            title={item.title}
            rating={item.rating}
            time={item.time}
            imageUrl={item.imageUrl}
            onPress={() => handleFoodItemPress(item)} // Use the handler here
          />
        ))}
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default HomeScreen;
