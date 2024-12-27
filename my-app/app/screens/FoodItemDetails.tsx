import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";

type FoodItemDetailsRouteProp = RouteProp<RootStackParamList, "FoodItemDetails">;

const FoodItemDetails: React.FC = () => {
  const route = useRoute<FoodItemDetailsRouteProp>();
  const navigation = useNavigation();
  const { foodItem } = route.params;

  const [quantity, setQuantity] = useState<number>(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${foodItem.title} to the cart`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/Back.png')}/>
        </TouchableOpacity>
        <Text style={styles.headerText}>Details</Text>
      </View>

      {/* Food Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: foodItem.imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Food Details */}
      <Text style={styles.title}>{foodItem.title}</Text>
      <Text style={styles.description}>{foodItem.description}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.rating}>⭐ {foodItem.rating}</Text>
        <Text style={styles.time}>⏱️ {foodItem.time}</Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.price}>${foodItem.price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  favoriteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#00000080",
    borderRadius: 20,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    color: "#888",
  },
  time: {
    fontSize: 16,
    color: "#888",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: 20,
  },
  priceQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#FF7622",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FoodItemDetails;
