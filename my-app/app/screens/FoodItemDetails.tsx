import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator"; // Correct import
import { useRoute } from "@react-navigation/native";

// Define the type for the route params to get the `foodItem`
type FoodItemDetailsRouteProp = RouteProp<RootStackParamList, "FoodItemDetails">;

const FoodItemDetails: React.FC = () => {
  // Get the route parameters (i.e., foodItem)
  const route = useRoute<FoodItemDetailsRouteProp>();
  const { foodItem } = route.params;

  // State to keep track of quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Function to increase quantity
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // Function to decrease quantity (minimum 1)
  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Handle "Add to Cart" button press
  const handleAddToCart = () => {
    // Logic to add to cart (you can pass the quantity and foodItem to a cart state or redux)
    console.log(`Added ${quantity} of ${foodItem.title} to the cart`);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: foodItem.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{foodItem.title}</Text>
      <br />
      <View style={styles.detailsContainer}>
  <Text style={styles.rating}>⭐ Rating: {foodItem.rating}</Text>
  <Text style={styles.time}>⏱️ Time: {foodItem.time}</Text>
</View>
      <Text style={styles.category}>Category: {foodItem.category}</Text>

      {/* Quantity Selection */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{quantity}</Text>

        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  rating: {
    fontSize: 18,
    color: "gray",
    paddingRight:10,
  },
  time: {
    fontSize: 18,
    color: "gray",
    paddingLeft:10,
  },
  category: {
    fontSize: 18,
    color: "gray",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 55,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 20,
  },
  addToCartButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addToCartText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsContainer: {
    flexDirection: "row",  // This makes the text elements appear on the same line
    paddingRight:10,
    marginBottom: 10,  // Optional: add some space at the bottom
  },
});

export default FoodItemDetails;
