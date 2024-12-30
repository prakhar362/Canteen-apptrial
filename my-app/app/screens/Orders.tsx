import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

// Mock Data
const mockOngoingOrders = [
  { id: "1", title: "Pizza", status: "Preparing", date: "2024-12-30" },
  { id: "2", title: "Burger", status: "Out for Delivery", date: "2024-12-29" },
];

const mockHistoryOrders = [
  { id: "3", title: "Pasta", status: "Delivered", date: "2024-12-28" },
  { id: "4", title: "Sandwich", status: "Delivered", date: "2024-12-27" },
];

const Orders = ({ navigation }: any) => {
  const [selectedSegment, setSelectedSegment] = useState("ongoing"); // Tracks whether "Ongoing" or "History" is selected

  // Determine which data to show based on the selected segment
  const data =
    selectedSegment === "ongoing" ? mockOngoingOrders : mockHistoryOrders;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/Back.png")}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={{ width: 50 }} /> {/* Placeholder for alignment */}
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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
            <Text style={styles.orderDate}>Date: {item.date}</Text>
            {selectedSegment === "ongoing" ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("TrackOrder", { orderId: item.id })}
              >
                <Text style={styles.actionButtonText}>Track Order</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("Review", { orderId: item.id })}
              >
                <Text style={styles.actionButtonText}>Rate</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.placeholderText}>
            No {selectedSegment === "ongoing" ? "ongoing" : "completed"} orders.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  backImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeSegment: {
    borderBottomColor: "#007BFF",
  },
  segmentText: {
    fontSize: 16,
    color: "#666",
  },
  activeSegmentText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  orderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  orderDate: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
});

export default Orders;
