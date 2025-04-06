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
import { Modal } from "react-native";

const Orders = ({ navigation }: any) => {
  const [selectedSegment, setSelectedSegment] = useState("ongoing");
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [orders, setOrders] = useState([]); // Store all orders first
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFoodItemNames, setSelectedFoodItemNames] = useState<string[]>([]);
  const [ratedOrders, setRatedOrders] = useState<string[]>([]); // Track rated order IDs
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null); // Track the selected order ID
  const [refundStatuses, setRefundStatuses] = useState<{[key: string]: boolean}>({}); // Track refund statuses

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

//load rate status
  useEffect(() => {
    const loadRatedOrders = async () => {
      try {
        const ratedOrdersJson = await AsyncStorage.getItem("ratedOrders");
        if (ratedOrdersJson) {
          setRatedOrders(JSON.parse(ratedOrdersJson));
        }
      } catch (error) {
        console.error("Error loading rated orders:", error);
      }
    };
  
    loadRatedOrders();
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
        console.log(data);

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
  }, [userId, selectedSegment]);

  // Check refund status for all orders
  useEffect(() => {
    const checkRefundStatuses = async () => {
      const newRefundStatuses: {[key: string]: boolean} = {};
      for (const order of orders) {
        const status = await AsyncStorage.getItem(`refund_${order.orderId}`);
        newRefundStatuses[order.orderId] = status === "granted";
      }
      setRefundStatuses(newRefundStatuses);
    };
    checkRefundStatuses();
  }, [orders]);

  const handleReviewSubmit = async (foodItemNames: string[], rating: number, comment: string) => {
    console.log("Submitting review with:", { foodItemNames, rating, comment });
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.error("User not authenticated");
        return;
      }
  
      const response = await fetch("https://canteen-web-1.onrender.com/app/api/v1/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodItemNames, rating, comment }),
      });
  
      const data = await response.json();
      console.log("Backend response:", data);
  
      if (response.ok) {
        // Mark the order as rated
        if (selectedOrderId) {
          const updatedRatedOrders = [...ratedOrders, selectedOrderId];
          setRatedOrders(updatedRatedOrders);
          await AsyncStorage.setItem("ratedOrders", JSON.stringify(updatedRatedOrders)); // Save to AsyncStorage
        }
        Alert.alert("Success", "Review submitted successfully");
        setReviewModalVisible(false);
      } else {
        Alert.alert("Error", data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Something went wrong while submitting the review.");
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/Back.png")}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedSegment === "ongoing" && styles.activeSegment,
          ]}
          onPress={() => setSelectedSegment("ongoing")}
        >
          <Text
            style={[
              styles.segmentText,
              selectedSegment === "ongoing" && styles.activeSegmentText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedSegment === "history" && styles.activeSegment,
          ]}
          onPress={() => setSelectedSegment("history")}
        >
          <Text
            style={[
              styles.segmentText,
              selectedSegment === "history" && styles.activeSegmentText,
            ]}
          >
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
      renderItem={({ item }) => {
        const isRejected = item.status.toLowerCase() === "rejected";
        const orderTime = new Date(item.orderDate);
        const currentTime = new Date();
        const timeDiff = (currentTime.getTime() - orderTime.getTime()) / 60000; // Difference in minutes
        const isRefundValid = timeDiff <= 60; // Refund valid for 30 minutes
        const isRated = ratedOrders.includes(item.orderId); // Check if the order is rated

        return (
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
              <Text style={styles.tokenNumber}>
                #{item.orderId.slice(-4)}
              </Text>
            </View>

            <Text
              style={[
                styles.orderStatus,
                isRejected && { color: "red" },
              ]}
            >
              Status: {item.status}
            </Text>
            <Text style={styles.orderDate}>
              Date: {orderTime.toLocaleString()}
            </Text>

            {selectedSegment === "ongoing" ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() =>
                    navigation.navigate("TrackOrder", { orderId: item.orderId })
                  }
                >
                  <Text style={styles.actionButtonText}>Track Order</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                {isRejected ? (
                  isRefundValid && !refundStatuses[item.orderId] ? (
                    <TouchableOpacity
                      style={styles.refundButton}
                      onPress={() => navigation.navigate("RefundPage", { 
                        orderId: item.orderId,
                        rejectedItems: item.items.filter((foodItem: any) => foodItem.status === "rejected")
                      })}
                    >
                      <Text style={styles.actionButtonText}>Refund</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.refundExpiredText}>
                      {refundStatuses[item.orderId]? "Refund Granted" : "Refund expired"}
                    </Text>
                  )
                ) : isRated ? (
                  <Text style={styles.alreadyRatedText}>Already Rated</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => {
                      setSelectedFoodItemNames(item.items.map((foodItem: any) => foodItem.foodName));
                      setSelectedOrderId(item.orderId); // Set the selected order ID
                      setReviewModalVisible(true);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Rate</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      }}

          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.placeholderText}>No orders found.</Text>
          }
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
        foodItemNames={selectedFoodItemNames}
      />
      <Modal
  transparent={true}
  animationType="fade"
  visible={showPopup}
  onRequestClose={() => setShowPopup(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>SHOW THIS AT COUNTER</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowPopup(false)}
      >
        <Text style={styles.closeButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
  orderCard: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 10, elevation: 3, overflow: 'hidden', },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderTitle: { fontSize: 16, fontWeight: "bold", color: "#333",flex: 1, flexWrap: 'wrap',marginRight: 10, },
  tokenNumber: { fontSize: 14, fontWeight: "500", color: "#FF7622", alignSelf: 'flex-end', },
  orderStatus: { fontSize: 14, color: "#666", marginTop: 5 },
  orderDate: { fontSize: 12, color: "#aaa", marginTop: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, gap: 10 },
  trackButton: { flex: 1, backgroundColor: "#FF7622", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  rateButton: { flex: 1, backgroundColor: "#FF7622", paddingVertical: 10, borderRadius: 5, alignItems: "center" },
  actionButtonText: { color: "#fff", fontWeight: "bold" },
  placeholderText: { textAlign: "center", color: "#aaa", fontSize: 16, marginTop: 20 },
  refundButton: {
    flex: 1,
    backgroundColor: "#E03D43", // Green for refund
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  refundExpiredText: {
    flex: 1,
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#FF7622",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  alreadyRatedText: {
    flex: 1,
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
  },
});

export default Orders;
