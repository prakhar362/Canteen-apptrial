import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState("");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !emailAddress || !message) {
      Alert.alert("Error", "Please fill out all fields before submitting.");
      return;
    }
  
    try {
      const response = await fetch("https://canteen-web-1.onrender.com/app/api/v1/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: emailAddress,
          message,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", data.message);
        setName("");
        setEmailAddress("");
        setMessage("");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button with Image */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={require("../app/assets/images/Back.png")} // Replace with your image path
          style={styles.backButtonImage}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Your Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginTop:15,
    alignSelf: "flex-start",
  },
  backButtonImage: {
    width: 50, 
    height: 50, 
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop:-25,
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FF7622",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ContactUs;
