import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Orders() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("ongoing"); // "ongoing" or "history"
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

   //Fetch orders from the database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with your API call to fetch orders
        const userId = "USER_ID"; // Replace with logged-in user's ID
        const response = await fetch(`https://your-api.com/orders/${userId}`);
        const data = await response.json();

        // Separate ongoing orders and history
        const ongoing = data.filter((order: any) => order.status === "ongoing");
        const history = data.filter((order: any) => order.status === "completed");

        setOngoingOrders(ongoing);
        setOrderHistory(history);
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Render individual order item
  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>{item.title}</Text>
      <Text style={styles.orderDetails}>{item.details}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/Back.png")} />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedTab === "ongoing" && styles.activeSegment,
          ]}
          onPress={() => setSelectedTab("ongoing")}
        >
          <Text
            style={[
              styles.segmentText,
              selectedTab === "ongoing" && styles.activeSegmentText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedTab === "history" && styles.activeSegment,
          ]}
          onPress={() => setSelectedTab("history")}
        >
          <Text
            style={[
              styles.segmentText,
              selectedTab === "history" && styles.activeSegmentText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <View style={styles.orderList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : selectedTab === "ongoing" ? (
          <FlatList
            data={ongoingOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No ongoing orders.</Text>}
          />
        ) : (
          <FlatList
            data={orderHistory}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No order history.</Text>}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#007BFF",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
    paddingLeft:25,
  },
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeSegment: {
    backgroundColor: "#007BFF",
  },
  segmentText: {
    fontSize: 16,
    color: "#333",
  },
  activeSegmentText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: "#007BFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default Orders;
