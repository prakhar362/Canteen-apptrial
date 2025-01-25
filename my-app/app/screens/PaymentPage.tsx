import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { WebView } from "react-native-webview"; // Import WebView

const PaymentPage: React.FC = ({ route }: any) => {
  const { totalAmount } = route.params; // Get the total amount from the previous page
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null); // For storing the Razorpay URL

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
          console.log("Result ID: ",result.id)
          // Construct the Razorpay payment URL
          const paymentUrl = 'https://checkout.razorpay.com/v1/checkout.js?order_id=${result.id}&key=rzp_test_kNTNMzLSu9RLNK';
          setPaymentUrl(paymentUrl); // Set payment URL for WebView
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

  // Handle payment process via WebView
  const handlePayment = () => {
    if (!orderId) {
      Alert.alert("Error", "Order creation failed.");
      return;
    }
    // If the orderId is available, the payment URL will be loaded in WebView
    if (paymentUrl) {
      
      console.log("Redirecting to Razorpay payment page...");
    } else {
      Alert.alert("Error", "Payment URL is not ready yet.");
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS !== "web" && paymentUrl ? ( // Check platform before rendering WebView
        <WebView
          source={{ uri: paymentUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={(event) => {
            if (event.url.includes("success")) {
              Alert.alert("Success", "Payment Successful!");
              // Call your backend to verify payment, etc.
            } else if (event.url.includes("failure")) {
              Alert.alert("Error", "Payment Failed!");
            }
          }}
        />
      ) : (
        <>
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
        </>
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
  webview: {
    width: "100%",
    height: "100%",
  },
});

export default PaymentPage;