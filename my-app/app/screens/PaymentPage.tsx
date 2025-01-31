import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../context/CartContext";

const PaymentPage: React.FC = ({ route, navigation }: any) => {
  const { totalAmount } = route.params;
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  const { viewCart } = useCart();
  const cartItems = viewCart();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }

        const response = await fetch(
          "https://canteen-web-demo.onrender.com/app/api/v1/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        } else {
          Alert.alert("Error", "Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const createOrder = async () => {
      if (!totalAmount || totalAmount <= 0) {
        Alert.alert("Error", "Invalid total amount.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          "https://canteen-web-demo.onrender.com/app/api/v1/createOrder",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: totalAmount }),
          }
        );

        const result = await response.json();

        if (response.ok && result.id) {
          setOrderId(result.id);
        } else {
          Alert.alert("Error", "Failed to create order. Please try again.");
        }
      } catch (error) {
        console.error("Error creating Razorpay order", error);
        Alert.alert("Error", "Failed to create order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [totalAmount]);

  const handlePayment = async () => {
    if (!orderId) {
      Alert.alert("Error", "Order creation failed.");
      return;
    }

    if (!userData) {
      Alert.alert("Error", "User data not available.");
      return;
    }

    try {
      const data = await RazorpayCheckout.open({
        description: "Canteen Order Payment",
        image: "https://your-logo-url.com/logo.png",
        currency: "INR",
        key: "rzp_test_qJLabrBReNvJWY",
        amount: totalAmount * 100,
        name: "Canteen Order",
        order_id: orderId,
        prefill: {
          email: userData.email || "user@example.com",
          contact: userData.phone || "9999999999",
          name: userData.username || "John Doe",
        },
        theme: { color: "#FF7622" },
      });

      console.log("Payment Success:", data);
      Alert.alert("Success", "Payment successful!");

      const orderData = {
        userId: userData._id,
        foodItems: cartItems.map((item) => ({
          foodItemId: item.id,
          name: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        paymentId: data.razorpay_payment_id,
        
      };

      try {
        const response = await fetch(
          "https://canteen-web-1.onrender.com/api/orders/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          }
        );

        const responseData = await response.json();
        console.log("Order Response:", responseData);
        console.log("OrderData: ",orderData);
      } catch (error) {
        console.error("Error posting order data:", error);
      }

      navigation.navigate("PaymentSuccessful");
    } catch (error) {
      console.error("Payment Failed:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Page</Text>
      <Text style={styles.amount}>Total Amount: ₹{totalAmount}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7622" />
      ) : (
        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          <Text style={styles.paymentButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  amount: {
    fontSize: 18,
    marginBottom: 30,
  },
  paymentButton: {
    backgroundColor: "#FF7622",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentPage;
