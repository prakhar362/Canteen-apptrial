import React from "react";

import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";

import RazorpayCheckout from "react-native-razorpay";

const CartScreen: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigation = useNavigation();

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const formattedRating = (rating:any) => {
      const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest 0.5
      const fullStars = Math.ceil(roundedRating); // Convert 1.5 to 2, 3.2 to 3, etc.
    
      return '⭐'.repeat(fullStars); // Generate stars
    };

  const renderCartItem = ({ item }:any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
  <Image source={{ uri: item.img }} style={styles.itemImage} />
</View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemTitle}>{formattedRating(item.rating)}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => removeFromCart(item.id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleNavigateToPayment = () => {
    const totalAmount = calculateTotal();
    navigation.navigate("MakePayment", { totalAmount });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
        <Image source={require("../assets/images/Back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>
      <FlatList
  data={cartItems}
  renderItem={renderCartItem}
  keyExtractor={(item) => item.id.toString()} // Convert ID to string
  style={styles.cartList}
/>


      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalAmount}>₹{calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handleNavigateToPayment}>
          <Text style={styles.placeOrderButtonText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginTop:10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 22,
  },
  headerTitle: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  cartList: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 24,
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  itemSize: {
    color: "#666666",
    fontSize: 14,
  },
  itemPrice: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  quantityButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  textAlignVertical: "center",
  lineHeight: 24,
  paddingBottom:3,
  },
  itemQuantity: {
    color: "#000000",
    fontSize: 16,
    marginHorizontal: 12,
  },
  removeButton: {
    width: 22,
    height: 22,
    borderRadius: 100,
    backgroundColor: "#FF4444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
    paddingBottom: 5,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  textAlignVertical: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "600",
  },
  totalAmount: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "600",
  },
  placeOrderButton: {
    backgroundColor: "#FF7622",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  

  });
  

export default CartScreen;
