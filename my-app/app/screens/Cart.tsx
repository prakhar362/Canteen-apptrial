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

  const renderCartItem = ({ item }:any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
  <Image source={{ uri: item.img }} style={styles.itemImage} />
</View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        ⭐ ⭐ ⭐ ⭐
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

  // Inside the component
const handlePayment = () => {
  const totalAmount = calculateTotal();

  const options = {
    description: "Order Payment",
    image: "https://example.com/logo.png", // Replace with your logo
    currency: "INR",
    order_id:"123",
    key: "rzp_test_I4JpbMLLjIb9tW", // Replace with your Razorpay key
    amount: totalAmount * 100, // Amount in paise
    name: "Food",
    prefill: {
      email: "ps15@gmail.com", // Prefill email
      contact: "7400102195", // Prefill phone number
      name: "Prakhar Shrivastava",
    },
    theme: { color: "#FF7622" },
  };

  RazorpayCheckout.open(options)
    .then((data) => {
      // Handle successful payment
      alert(`Payment Success! Payment ID: ${data.razorpay_payment_id}`);
      
    })
    .catch((error) => {
      // Handle payment failure
      alert(`Payment Failed! Error: ${error.description}`);
    });
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePayment}>
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
    fontSize: 18,
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
  },
  quantityButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
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
    fontSize: 20,
    fontWeight: "bold",
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
    color: "#666666",
    fontSize: 14,
  },
  totalAmount: {
    color: "#000000",
    fontSize: 24,
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
