import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native"; // Import the hook

type CartScreenRouteProp = RouteProp<RootStackParamList, "Cart">;

const CartScreen: React.FC = () => {
  const route = useRoute<CartScreenRouteProp>();
  const { cartItems } = route.params || { cartItems: [] };

  const [cart, setCart] = useState(cartItems);
  const navigation = useNavigation(); // Initialize the navigation hook

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter((item: { id: string }) => item.id !== id));
  };

  const handleQuantityChange = (id: string, change: number) => {
    setCart(
      cart.map((item: any) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const calculateTotal = () =>
    cart.reduce(
      (total: number, item: { price: number; quantity: number }) =>
        total + item.price * item.quantity,
      0
    );

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        {/* Placeholder for item image */}
        <View style={styles.itemImage} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSize}>14"</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        style={styles.cartList}
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton}>
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
    fontSize: 20,
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
    backgroundColor: "#F5F5F5",
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
    paddingBottom:5,
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
