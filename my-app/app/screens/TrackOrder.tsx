import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image, StyleSheet 
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import ReviewModal from "./Review";


const orderStatusSteps = [
  { label: "Not Received", key: "pending" },
  { label: "Received & Preparing", key: "accepted" },
  { label: "Ready for Pickup", key: "prepared" },
];

const TrackOrder = ({ route }) => {
  const [order, setOrder] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchOrderStatus = async (orderIdFromProps?: string) => {
    try {
      const orderId = orderIdFromProps || (await SecureStore.getItemAsync("secureOrderId"));
      if (!orderId) throw new Error("Order ID not found");

      const response = await fetch(`https://canteen-web-1.onrender.com/app/api/v1/order-status/${orderId}`);
      const data = await response.json();
      setOrder(data);

      // Update progress
      const statusIndex = orderStatusSteps.findIndex(step => step.key === data.status);
      if (statusIndex !== -1) {
        setProgress(statusIndex);
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  useEffect(() => {
    const { orderId } = route.params || {}; // Get orderId from navigation params
    fetchOrderStatus(orderId); // Fetch with orderId if provided

    const interval = setInterval(() => fetchOrderStatus(orderId), 300000); // Fetch every 5 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, [route.params?.orderId]); // Re-run effect if orderId changes

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/images/Back.png")} style={styles.backImage} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Track Order</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer} />
        <View style={styles.mainContainer}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order Id: {order.orderId.slice(-4)}</Text>
            <Text style={styles.orderDate}>Ordered On {order.date} at {order.time}</Text>
          </View>

          <View style={styles.itemsContainer}>
            {order.items.map((item: any, index: any) => (
              <Text key={index} style={styles.item}>{item.quantity}x {item.name}</Text>
            ))}
          </View>

          {/* Order Status Progress Bar */}
          <View style={styles.progressContainer}>
      {/* Vertical Line */}
      <View style={styles.progressLineContainer}>
        <View style={styles.progressLine} />
        <View style={[styles.progressLineFilled, { height: `${(progress - 1) * 39}%` }]} />
      </View>

      {/* Status Points */}
      <View style={styles.statusPoints}>
        {[
          { label: "Not Received", timeOffset: 5 },
          { label: "Preparing your food", timeOffset: 10 },
          { label: "Ready for pickup", timeOffset: 15 },
        ].map((status, index) => (
          <View key={index} style={styles.statusPoint}>
            <View style={[styles.point, progress >= index  && styles.pointActive]}>
              <View style={styles.innerPoint} />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusText, progress >= index  && styles.statusTextActive]}>
                {status.label}
              </Text>
              <Text style={styles.statusTime}>{`Expected ${order.time} + ${status.timeOffset} min`}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>

          {/* Estimated Delivery Time */}
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTime}>20 min</Text>
            <Text style={styles.estimatedText}>ESTIMATED DELIVERY TIME</Text>
          </View>

          {/* Rate Order Button */}
          {order.status === "prepared" && (
            <TouchableOpacity style={styles.rateOrderButton} onPress={() => setReviewModalVisible(true)}>
              <Text style={styles.rateOrderText}>Rate Order</Text>
            </TouchableOpacity>
          )}
  {/* Review Modal */}
  <ReviewModal visible={isReviewModalVisible} onClose={() => setReviewModalVisible(false)} onSubmit={function (rating: number, comment: string): void {
        throw new Error("Function not implemented.");
      }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: {
    padding: 8,
  },
  backImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#1A1A1A",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#E9ECEF",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderInfo: {
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#6C757D",
  },
  itemsContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  item: {
    fontSize: 15,
    color: "#495057",
    marginBottom: 4,
  },
  deliveryInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  deliveryTime: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF7622",
    marginBottom: 4,
  },
  estimatedText: {
    fontSize: 12,
    color: "#6C757D",
    letterSpacing: 0.5,
  },
  rateOrderButton: {
    backgroundColor: "#FF7622",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  rateOrderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  progressContainer: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 16,
    position: "relative",
  },
  progressLineContainer: {
    width: 3,
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 28,
  },
  progressLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 46,
    backgroundColor: "#E9ECEF",
    borderRadius: 1.5,
  },
  progressLineFilled: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FF7622",
    borderRadius: 1.5,
  },
  statusPoints: {
    flex: 1,
  },
  statusPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  point: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E9ECEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  pointActive: {
    backgroundColor: "#FF7622",
  },
  innerPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 15,
    color: "#6C757D",
    marginBottom: 4,
  },
  statusTextActive: {
    color: "#FF7622",
    fontWeight: "500",
  },
  statusTime: {
    fontSize: 13,
    color: "#6C757D",
  },
});

export default TrackOrder;
