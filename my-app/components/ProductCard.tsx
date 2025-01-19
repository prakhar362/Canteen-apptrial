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

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  title,
  rating,
  time,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.rating}>⭐ Rating: 4</Text>
        <Text style={styles.time}>⏱️ Time: 15 min</Text>
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
