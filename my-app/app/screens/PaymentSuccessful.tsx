import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust the import path based on your file structure

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSuccessful'>;

const PaymentSuccessful: React.FC = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();

  const handleTrackOrder = () => {
    navigation.navigate('TrackOrder');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.token}>TOKEN NO: 115</Text>
      <Image
        source={require("../assets/images/thankyou.jpeg")}
        style={styles.image}
      />
      <Text style={styles.congratulations}>Congratulations!</Text>
      <Text style={styles.message}>
        You successfully made a payment, enjoy our service!
      </Text>
      <TouchableOpacity 
        style={styles.trackOrderButton} 
        onPress={handleTrackOrder}
        activeOpacity={0.8}
      >
        <Text style={styles.trackOrderText}>TRACK ORDER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  token: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  congratulations: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
  trackOrderButton: {
    backgroundColor: "#FF7622",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  trackOrderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentSuccessful;