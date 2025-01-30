import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import RazorpayCheckout from 'react-native-razorpay';

const PaymentPage: React.FC = ({ route,navigation }: any) => {
  const { totalAmount } = route.params;
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const createOrder = async () => {
      if (!totalAmount || totalAmount <= 0) {
        Alert.alert("Error", "Invalid total amount.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("https://canteen-web-demo.onrender.com/app/api/v1/createOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: totalAmount }),
        });

        const result = await response.json();

        if (response.ok && result.id) {
          setOrderId(result.id); // Store order ID
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

    try {
      const data = await RazorpayCheckout.open({
        description: "Canteen Order Payment",
        image: "https://your-logo-url.com/logo.png",
        currency: "INR",
        key: "rzp_test_qJLabrBReNvJWY",
        amount: totalAmount * 100, // Convert to paise
        name: "Canteen Order",
        order_id: orderId, // This is mandatory
        prefill: {
          email: "user@example.com",
          contact: "9999999999",
          name: "John Doe",
        },
        theme: { color: "#FF7622" },
      });

      console.log("Payment Success:", data);
      Alert.alert("Success", "Payment successful!");
      // Handle success logic (e.g., update order status, navigate)
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
      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.paymentButtonText}>
          {loading ? "Processing..." : "Pay Now"}
        </Text>
      </TouchableOpacity>
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
