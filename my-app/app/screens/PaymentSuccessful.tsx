import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCart } from '../context/CartContext';

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSuccessful'>;

const PaymentSuccessful: React.FC = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [tokenNo, setTokenNo] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }

        const response = await fetch(
          "https://canteen-web-1.onrender.com/app/api/v1/profile",
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
          setUserId(data._id);
        } else {
          Alert.alert("Error", "Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Something went wrong while fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      if (!userId) return;
      try {
        const tokenResponse = await fetch(
          "https://canteen-web-1.onrender.com/app/api/v1/generatetoken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
  
        const tokenData = await tokenResponse.json();
  
        if (!tokenData.success) {
          Alert.alert("Error", "Failed to retrieve token number.");
          return;
        }
  
        const fullOrderId = tokenData.orderId; // Full order ID
  
        // Store securely in SecureStore
        await SecureStore.setItemAsync("secureOrderId", fullOrderId);
  
        // Display only the last 4 characters
        setTokenNo(fullOrderId.slice(-4)); 

        // Clear the cart after successful payment
        clearCart();
      } catch (error) {
        console.error("Error fetching token number:", error);
        Alert.alert("Error", "Something went wrong while fetching token number.");
      }
    };
  
    fetchToken();
  }, [userId, clearCart]);

  const handleTrackOrder = () => {
    navigation.navigate('TrackOrder');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.token}>TOKEN NO: {tokenNo || "Loading..."}</Text>
      <Image
        source={require("../assets/images/thankyou.jpeg")}
        style={styles.image}
      />
      <Text style={styles.congratulations}>Congratulations!</Text>
      <Text style={styles.message}>
        You successfully made a payment, enjoy our service!
      </Text>
      <TouchableOpacity 
        style={styles.trackOrderButton} 
        onPress={handleTrackOrder}
        activeOpacity={0.8}
      >
        <Text style={styles.trackOrderText}>TRACK ORDER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  token: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  congratulations: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
  trackOrderButton: {
    backgroundColor: "#FF7622",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  trackOrderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentSuccessful;
