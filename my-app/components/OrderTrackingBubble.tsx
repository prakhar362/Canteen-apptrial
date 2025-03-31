import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import {sendLocalNotification} from '../components/Notifications'

const OrderTrackingBubble = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  // Fetch user ID from AsyncStorage
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
        console.log("User data: ",data);

        if (response.ok) {
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

  const fetchOrderStatus = async () => {
    if (!userId) return;
  
    try {
      const response = await fetch(
        `https://canteen-web-1.onrender.com/app/api/v1/orders/${userId}`
      );
      const data = await response.json();
      console.log(data);
  
      if (data.latestOrder && data.latestOrder._id) {
        const latestOrder = data.latestOrder;
        const newStatus = latestOrder.status.toLowerCase();
  
        // Get the previous status from AsyncStorage
        const prevStatus = await AsyncStorage.getItem("orderStatus");
  
        if (prevStatus !== newStatus) {
          sendLocalNotification(latestOrder._id, newStatus);
          await AsyncStorage.setItem("orderStatus", newStatus);
        }
  
        // If the latest order is completed or rejected
        if (newStatus === "completed" || newStatus === "rejected") {
          if (data.nextOrder && data.nextOrder._id) {
            const nextOrderId = data.nextOrder._id;
            const nextOrderStatus = data.nextOrder.status.toLowerCase();

            // Retrieve the last notified nextOrderId and nextOrderStatus
            const [storedNextOrderId, storedNextOrderStatus] = await Promise.all([
              AsyncStorage.getItem("nextOrderId"),
              AsyncStorage.getItem("nextOrderStatus"),
            ]);

            // Send notification ONLY if the nextOrderId OR nextOrderStatus has changed
            if (storedNextOrderId !== nextOrderId || storedNextOrderStatus !== nextOrderStatus) {
              sendLocalNotification(nextOrderId, nextOrderStatus);

              // Update stored values in parallel
              await Promise.all([
                await SecureStore.setItemAsync("secureOrderId", nextOrderId),
                AsyncStorage.setItem("nextOrderId", nextOrderId),
                AsyncStorage.setItem("nextOrderStatus", nextOrderStatus),
              ]);
            }

            setOrder(data.nextOrder);
          } else {
            setOrder(null); // Hide the bubble if no next order
          }
        } else {
          setOrder(latestOrder);
        }
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Initial fetch and polling every 2 minutes
  useEffect(() => {
    fetchOrderStatus(); // Initial call

    const interval = setInterval(() => {
      fetchOrderStatus();
    }, 12000); // 2 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="small" color="#FF8C00" />;
  }

  // Hide bubble if no order or order is completed
  if (!order || order.status.toLowerCase() === "completed") {
    
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <MaterialIcons name="access-time" size={24} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.timeText}>Your order is {order.status}</Text>
          <Text style={styles.statusText}>Order ID: {order._id?.slice(-4)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => navigation.navigate("TrackOrder")}
      >
        <Text style={styles.trackButtonText}>Track</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 165, 0, 0.95)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    gap: 4,
  },
  timeText: {
    fontWeight: "600",
    color: "#fff",
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.9,
  },
  trackButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  trackButtonText: {
    color: "#FF8C00",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default OrderTrackingBubble;
