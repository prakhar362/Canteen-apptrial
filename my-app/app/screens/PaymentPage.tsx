import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const PaymentPage: React.FC = ({ route }: any) => {
  const { totalAmount } = route.params; // Get the total amount from the previous page
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Create an order when the component mounts
  useEffect(() => {
    const createOrder = async () => {
      if (!totalAmount || totalAmount <= 0) {
        console.log("Invalid amount:", totalAmount);
        Alert.alert("Error", "Invalid total amount.");
        return;
      }
      setLoading(true);
      try {
        console.log("Sending request to create order...");
        const response = await fetch("http://localhost:5000/app/api/v1/createOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: totalAmount }),
        });

        const result = await response.json();
        console.log("Order creation response:", result);

        if (response.ok && result.id) {
          setOrderId(result.id); // Set the order ID from the response
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

  // Handle payment process
  const handlePayment = () => {
    if (!orderId) {
      Alert.alert("Error", "Order creation failed.");
      return;
    }

    const options = {
      description: "Order Payment",
      image: "https://example.com/logo.png", // Add your logo URL
      currency: "INR",
      order_id: orderId,
      key: "rzp_test_I4JpbMLLjIb9tW", // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise
      name: "Food App",
      prefill: {
        email: "user@example.com",
        contact: "1234567890",
        name: "John Doe",
      },
      theme: { color: "#FF7622" },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        console.log("Payment data:", data);
        Alert.alert("Success", `Payment Successful! Payment ID: ${data.razorpay_payment_id}`);
        confirmPayment(data.razorpay_payment_id);
      })
      .catch((error) => {
        console.error("Payment Error:", error);
        Alert.alert("Error", `Payment Failed! Error: ${error.description}`);
      });
  };

  // Confirm the payment on the backend (optional but recommended)
  const confirmPayment = async (paymentId: string) => {
    try {
      console.log("Sending request to confirm payment...");
      const response = await fetch("http://localhost:5000/app/api/v1/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId }),
      });

      const result = await response.json();
      console.log("Payment confirmation response:", result);

      if (response.ok) {
        console.log("Payment confirmed:", result);
      } else {
        Alert.alert("Payment Confirmation Failed", "Please contact support.");
      }
    } catch (error) {
      console.error("Error confirming payment", error);
      Alert.alert("Error", "Payment confirmation failed.");
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
