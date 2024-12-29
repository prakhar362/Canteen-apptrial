// TrackOrder.tsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReviewModal from "./Review";

const TrackOrder = () => {
  const [progress, setProgress] = useState(1);
  const [showReview, setShowReview] = useState(false);

  const handleReviewSubmit = (rating: number, comment: string) => {
    console.log('Rating:', rating, 'Comment:', comment);
    // Add your API call here to submit the review
    setShowReview(false);
  };

  const handleProgress = (step: number) => {
    const newProgress = Math.min(Math.max(progress + step, 1), 3);
    setProgress(newProgress);

    if (newProgress === 3) {
      setTimeout(() => {
        setShowReview(true);
      }, 5000);
    }
  };

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
              <View style={[styles.progressLineFilled, { height: `${(progress - 1) * 39}%` }]} />
            </View>

            {/* Status Points */}
            <View style={styles.statusPoints}>
              <View style={styles.statusPoint}>
                <View style={[styles.point, progress >= 1 && styles.pointActive]}>
                  <View style={styles.innerPoint} />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.statusText, progress >= 1 && styles.statusTextActive]}>
                    Order received
                  </Text>
                  <Text style={styles.statusTime}>10:00 PM</Text>
                </View>
              </View>

              <View style={styles.statusPoint}>
                <View style={[styles.point, progress >= 2 && styles.pointActive]}>
                  <View style={styles.innerPoint} />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.statusText, progress >= 2 && styles.statusTextActive]}>
                    Preparing your food
                  </Text>
                  <Text style={styles.statusTime}>10:05 PM</Text>
                </View>
              </View>

              <View style={styles.statusPoint}>
                <View style={[styles.point, progress >= 3 && styles.pointActive]}>
                  <View style={styles.innerPoint} />
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={[styles.statusText, progress >= 3 && styles.statusTextActive]}>
                    Ready for pickup
                  </Text>
                  <Text style={styles.statusTime}>Expected 10:20 PM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.yellowButton]}
              onPress={() => handleProgress(1)}
            >
              <Text style={styles.buttonText}>Next Step</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.greenButton]}
              onPress={() => handleProgress(2)}
            >
              <Text style={styles.buttonText}>Skip to Ready</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Review Modal */}
      <ReviewModal
        visible={showReview}
        onClose={() => setShowReview(false)}
        onSubmit={handleReviewSubmit}
      />
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
    minHeight: 500,
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
  bottomPadding: {
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  yellowButton: {
    backgroundColor: "#FFC107",
  },
  greenButton: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TrackOrder;