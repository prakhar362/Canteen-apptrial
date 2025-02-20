import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReviewModal from "./Review";

const Orders = ({ navigation }: any) => {
  const [selectedSegment, setSelectedSegment] = useState("ongoing");
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]); // Store all orders first
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user data
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

  // Fetch orders
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }

        const url =
          selectedSegment === "history"
            ? `https://canteen-web-1.onrender.com/app/api/v1/order-history/${userId}`
            : `https://canteen-web-1.onrender.com/app/api/v1/view-orders/${userId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Something went wrong while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, selectedSegment]); // Added selectedSegment as a dependency

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/Back.png")} style={styles.backImage} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segmentButton, selectedSegment === "ongoing" && styles.activeSegment]}
          onPress={() => setSelectedSegment("ongoing")}
        >
          <Text style={[styles.segmentText, selectedSegment === "ongoing" && styles.activeSegmentText]}>
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, selectedSegment === "history" && styles.activeSegment]}
          onPress={() => setSelectedSegment("history")}
        >
          <Text style={[styles.segmentText, selectedSegment === "history" && styles.activeSegmentText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {loading ? (
        <Text style={styles.placeholderText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.placeholderText}>{error}</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item: any) => item.orderId}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>
                  {item.items.map((foodItem: any, index: any) => (
                    <Text key={index}>
                      {foodItem.foodName}
                      {index < item.items.length - 1 && ", "}
                    </Text>
                  ))}
                </Text>
                <Text style={styles.tokenNumber}>#{item.orderId.slice(-4)}</Text>
              </View>
              <Text style={styles.orderStatus}>Status: {item.status}</Text>
              <Text style={styles.orderDate}>Date: {new Date(item.orderDate).toLocaleString()}</Text>
              {selectedSegment === "ongoing" ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate("TrackOrder", { orderId: item.orderId })}
                  >
                    <Text style={styles.actionButtonText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.rateButton} onPress={() => setReviewModalVisible(true)}>
                    <Text style={styles.actionButtonText}>Rate</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.placeholderText}>No orders found.</Text>}
        />
      )}

      {/* Review Modal */}
      <ReviewModal visible={isReviewModalVisible} onClose={() => setReviewModalVisible(false)} onSubmit={function (rating: number, comment: string): void {
        throw new Error("Function not implemented.");
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, backgroundColor: "#fff", elevation: 3},
  backImage: { width: 45, height: 45, resizeMode: "contain",marginTop:15},
  headerTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#333", 
    flex: 1,  // Takes up remaining space
    textAlign: "center",  // Centers the text
    marginTop:15,
    marginRight: 40,  // Adjust as needed for perfect centering
  },  segmentedControl: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 15 },
  segmentButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  activeSegment: { borderBottomColor: "#FF7622" },
  segmentText: { fontSize: 16, color: "#666" },
  activeSegmentText: { color: "#FF7622", fontWeight: "bold" },
  orderCard: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 10, elevation: 3 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  tokenNumber: { fontSize: 14, fontWeight: "500", color: "#FF7622" },
  orderStatus: { fontSize: 14, color: "#666", marginTop: 5 },
  orderDate: { fontSize: 12, color: "#aaa", marginTop: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, gap: 10 },
  trackButton: { flex: 1, backgroundColor: "#FF7622", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  rateButton: { flex: 1, backgroundColor: "#FF7622", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  actionButtonText: { color: "#fff", fontWeight: "bold" },
  placeholderText: { textAlign: "center", color: "#aaa", fontSize: 16, marginTop: 20 },
});

export default Orders;
