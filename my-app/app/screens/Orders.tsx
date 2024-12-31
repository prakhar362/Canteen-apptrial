import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import ReviewModal from "./Review";

const mockHistoryOrders = [
  { id: "3", title: "Pasta", status: "Delivered", date: "2024-12-28", token: "A123" },
  { id: "4", title: "Sandwich", status: "Delivered", date: "2024-12-27", token: "A124" },
];

const Orders = ({ navigation }: any) => {
  const [selectedSegment, setSelectedSegment] = useState("ongoing");
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const mockOngoingOrders = [
    { id: "1", title: "Pizza", status: "Preparing", date: "2024-12-30", token: "A125" },
    { id: "2", title: "Burger", status: "Out for Delivery", date: "2024-12-29", token: "A126" },
  ];

  const data =
    selectedSegment === "ongoing" ? mockOngoingOrders : mockHistoryOrders;

  const handleOpenReview = (order: any) => {
    setSelectedOrder(order);
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    console.log("Order:", selectedOrder);
    console.log("Rating:", rating, "Comment:", comment);
    setReviewModalVisible(false);
  };

  const handleCancelOrder = (orderId: string) => {
    console.log("Cancelling order:", orderId);
    // Add your cancel order logic here
  };

  const handleReorder = (order: any) => {
    console.log("Reordering:", order);
    // Add your reorder logic here
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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>{item.title}</Text>
              <Text style={styles.tokenNumber}>#{item.token}</Text>
            </View>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
            <Text style={styles.orderDate}>Date: {item.date}</Text>
            {selectedSegment === "ongoing" ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() =>
                    navigation.navigate("TrackOrder", { orderId: item.id })
                  }
                >
                  <Text style={styles.actionButtonText}>Track Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelOrder(item.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.rateButton}
                  onPress={() => handleOpenReview(item)}
                >
                  <Text style={styles.actionButtonText}>Rate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reorderButton}
                  onPress={() => handleReorder(item)}
                >
                  <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
              </View>
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

      {/* Review Modal */}
      <ReviewModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
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
    elevation: 3,
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
    borderBottomColor: "#FF7622",
  },
  segmentText: {
    fontSize: 16,
    color: "#666",
  },
  activeSegmentText: {
    color: "#FF7622",
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tokenNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FF7622",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  trackButton: {
    flex: 1,
    backgroundColor: "#FF7622",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF7622",
  },
  rateButton: {
    flex: 1,
    backgroundColor: "#FF7622",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  reorderButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF7622",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cancelButtonText: {
    color: "#FF7622",
    fontWeight: "bold",
    fontSize: 14,
  },
  reorderButtonText: {
    color: "#FF7622",
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