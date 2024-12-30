import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define the stack's navigation prop
type RootStackParamList = {
  Home: undefined; // Replace with your actual route names
  Profile: undefined;
};

type ProfilePageProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfilePage: React.FC<ProfilePageProps> = ({ navigation }) => {
  // State variables for user details
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("123-456-7890");
  const [email, setEmail] = useState("john.doe@example.com");
  const [bio, setBio] = useState("I love Fast Food");
  // State to track if the page is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle saving updated details
  const handleSave = () => {
    setIsEditing(false); // Exit edit mode
    Alert.alert("Profile Updated", "Your details have been successfully updated!");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/images/Back.png")} />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Info</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../assets/images/ProfilePic.png")}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
          {isEditing ? (
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Enter your bio"
            />
          ) : (
            <Text style={styles.bioText}>{bio}</Text>
          )}
        </View>
      </View>

      {/* Profile Details */}
      <View style={styles.profileDetails}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Image
            source={require("../assets/images/Name.png")}
            style={styles.icon}
          />
          <Text style={styles.label}>NAME:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.text}>{name}</Text>
          )}
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Image
            source={require("../assets/images/Phone.png")}
            style={styles.icon}
          />
          <Text style={styles.label}>PHONE:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.text}>{phone}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Image
            source={require("../assets/images/Email.png")}
            style={styles.icon}
          />
          <Text style={styles.label}>EMAIL:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.text}>{email}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#F5EFFF",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#F14A00",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bioText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  bioInput: {
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  profileDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#32343E",
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "#32343E",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 3,
    paddingVertical: 8,
  },
});

export default ProfilePage;
