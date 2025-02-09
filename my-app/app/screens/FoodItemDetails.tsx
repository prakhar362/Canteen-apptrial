import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useCart } from "../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FoodItemDetailsRouteProp = RouteProp<RootStackParamList, "FoodItemDetails">;

const FoodItemDetails: React.FC = () => {
  const route = useRoute<FoodItemDetailsRouteProp>();
  const navigation = useNavigation();
  const { foodItem } = route.params;
  const { addToCart } = useCart();

  const [foodDetails, setFoodDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const token = await AsyncStorage.getItem("userToken"); // Retrieve token from AsyncStorage
  
        if (!token) {
          throw new Error("User token not found. Please log in again.");
        }
  
        const response = await fetch(
          `https://canteen-web-1.onrender.com/app/api/v1/fooditem/${foodItem._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to load food details. Please try again.");
        }
  
        const data = await response.json();
        console.log(data);
        setFoodDetails(data);
      } catch (err:any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFoodDetails();
  }, [foodItem._id]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    const newCartItem = {
      id: foodDetails._id,
      title: foodDetails.name,
      img: foodDetails.img,
      price: foodDetails.price,
      quantity,
    };
    addToCart(newCartItem);
    navigation.navigate("Cart");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/Back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Details</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: foodDetails.img }} style={styles.image} />
      </View>

      <Text style={styles.title}>{foodDetails.name}</Text>
      <Text style={styles.description}>{foodDetails.description}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.rating}>Rating: ⭐ ⭐ ⭐ ⭐</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.price}>₹ {foodDetails.price.toFixed(2)}</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    color: "#000",
    fontSize: 18,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
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
  footer: {
    flex: 1, 
  justifyContent: "flex-end",
  marginBottom: 2, 
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    height:30,
    width:35,
    marginHorizontal: 10,
    alignItems: "center", // Centers horizontally
  justifyContent: "center", // Centers vertically
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
