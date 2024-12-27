import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TrackOrder = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Track Order</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Space for Image */}
        <View style={styles.imageContainer}>
          {/* Add your image component here */}
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContainer}>
          {/* Order Details */}
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order Id: 115</Text>
            <Text style={styles.orderDate}>Ordered At 06 Sept, 10:00pm</Text>
          </View>

          <View style={styles.itemsContainer}>
            <Text style={styles.item}>2x Veg Cheese Aloo Frankie</Text>
            <Text style={styles.item}>1x Veg Biryani</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTime}>20 min</Text>
            <Text style={styles.estimatedText}>ESTIMATED DELIVERY TIME</Text>
          </View>

          {/* Vertical Progress Tracker */}
          <View style={styles.progressContainer}>
            {/* Vertical Line */}
            <View style={styles.progressLineContainer}>
              <View style={styles.progressLine} />
              <View style={styles.progressLineFilled} />
            </View>

            {/* Status Points */}
            <View style={styles.statusPoints}>
              <View style={styles.statusPoint}>
                <View style={[styles.point, styles.pointActive]}>
                  <View style={styles.innerPoint} />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.statusText, styles.statusTextActive]}>
                    Order received
                  </Text>
                  <Text style={styles.statusTime}>10:00 PM</Text>
                </View>
              </View>

              <View style={styles.statusPoint}>
                <View style={[styles.point, styles.pointActive]}>
                  <View style={styles.innerPoint} />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.statusText, styles.statusTextActive]}>
                    Preparing your food
                  </Text>
                  <Text style={styles.statusTime}>10:05 PM</Text>
                </View>
              </View>

              <View style={styles.statusPoint}>
                <View style={styles.point}>
                  <View style={styles.innerPoint} />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusText}>Ready for pickup</Text>
                  <Text style={styles.statusTime}>Expected 10:20 PM</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
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
    paddingTop: 8,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: {
    padding: 8,
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
    minHeight: 500, // Ensures enough space for content
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
  progressContainer: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 16,
    position: 'relative',
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
    bottom: 0,
    backgroundColor: "#E9ECEF",
    borderRadius: 1.5,
  },
  progressLineFilled: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "66%",
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
  bottomPadding: {
    height: 40, // Adds extra padding at the bottom
  },
});

export default TrackOrder;