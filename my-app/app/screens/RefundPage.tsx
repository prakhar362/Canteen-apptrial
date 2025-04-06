import React, { useState, useEffect } from "react";
import { View, Text,Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type RefundPageRouteProp = RouteProp<RootStackParamList, "RefundPage">;

interface RefundPageProps {
  route: RefundPageRouteProp;
}

const RefundPage: React.FC<RefundPageProps> = ({ route }) => {
  const navigation = useNavigation();
  const { orderId, rejectedItems } = route.params;
  const [isRequested, setIsRequested] = useState(false);
  console.log("Rejected items: ", rejectedItems);
  useEffect(() => {
    // Check if the refund has already been requested
    const checkRefundStatus = async () => {
      const status = await AsyncStorage.getItem(`refund_${orderId}`);
      if (status === "granted") {
        setIsRequested(true);
      }
    };
    checkRefundStatus();
  }, [orderId]);

  const handleRefundRequest = async () => {
    setIsRequested(true);
    await AsyncStorage.setItem(`refund_${orderId}`, "granted"); // Save the refund status
  };

  return (
    <View style={styles.container}>
        <Image
                source={require("../assets/images/refund.jpg")}
                style={styles.image}
              />
      <Text style={styles.title}>Refund Request</Text>
      <Text style={styles.text}>Order ID: {orderId.slice(-4)}</Text>

      <Text style={styles.subTitle}>Rejected Items:</Text>
      {Array.isArray(rejectedItems) && rejectedItems.length > 0 ? (
        <>
          {rejectedItems.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.name} - ₹{item.price.toFixed(2)} x {item.quantity} = <Text style={styles.boldText}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </Text>
          ))}
          <Text style={[styles.totalText, styles.boldText]}>
            Total to be refunded: ₹{rejectedItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
          </Text>
        </>
      ) : (
        <Text style={styles.itemText}>No rejected items found.</Text>
      )}

      <View>
        {isRequested ? (
          <Text style={styles.grantedText}>Request has been granted</Text>
        ) : (
          <TouchableOpacity style={styles.refundButton} onPress={handleRefundRequest}>
            <Text style={styles.refundButtonText}>Request Refund</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.noteText}>
        * Please click "Request Refund" only at the counter. Refund will be validated by the canteen staff.
      </Text>
    </View>
  );
};

export default RefundPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  itemText: {
    fontSize: 16,
    color: "black",
    marginBottom: 2,
  },
  refundButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  refundButtonText: {
    color: "white",
    fontSize: 16,
  },
  grantedText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
  noteText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 18,
    marginTop: 10,
    color: '#333',
  },
});
