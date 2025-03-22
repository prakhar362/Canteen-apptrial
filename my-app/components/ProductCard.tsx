// FoodItemCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

// Define the props for FoodItemCard
interface FoodItemCardProps {
  title: string;
  rating: number;
  time: string;
  imageUrl: string;
  onPress: () => void; // Handler when the card is clicked
}

const roundToNearestHalf = (value: number): number => {
  return Math.round(value * 2) / 2;
};

const formatRating = (rating: number): string => {
  const roundedRating = roundToNearestHalf(rating); // Round to nearest 0.5
  // Check if the rating is a whole number
  if (roundedRating % 1 === 0) {
    return `${roundedRating}`; // No decimal point
  } else {
    return `${roundedRating.toFixed(1)}`; // One decimal place
  }
};
const FoodItemCard: React.FC<FoodItemCardProps> = ({
  title,
  rating,
  time,
  imageUrl,
  onPress,
}) => {
  // Round the rating to the nearest 0.5
  const formattedRating = formatRating(rating);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.rating}>{formattedRating}⭐</Text>
        <Text style={styles.time}>Time: {time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 14,
    color: "gray",
  },
  time: {
    fontSize: 14,
    color: "gray",
  },
});

export default FoodItemCard;
