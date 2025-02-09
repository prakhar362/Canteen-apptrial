import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type ProfilePageProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfilePage: React.FC<ProfilePageProps> = ({ navigation }) => {
  const [username, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "No token found. Please log in again.");

          return;
        }
        
        const response = await fetch("https://canteen-web-1.onrender.com/app/api/v1/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setName(data.username);
        setPhone(data.phoneNumber);
        setEmail(data.email);
        
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    // Clean the phone number before sending
    const formattedPhone = phone.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    // Log the data to be sent
    console.log("Saving data:", { username, phone, email });

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }

      const response = await fetch("https://canteen-web-1.onrender.com/app/api/v1/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, phone, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/images/Back.png")}
                        style={styles.backButtonImage}

          />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Info</Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../assets/images/default_profile_pic.png")}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{username}</Text>
        </View>
      </View>
      <View style={styles.profileDetails}>
        <View style={styles.inputGroup}>
          <Image source={require("../assets/images/Name.png")} style={styles.icon} />
          <Text style={styles.label}>NAME:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.text}>{username}</Text>
          )}
        </View>
        <View style={styles.inputGroup}>
          <Image source={require("../assets/images/Phone.png")} style={styles.icon} />
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
        <View style={styles.inputGroup}>
          <Image source={require("../assets/images/Email.png")} style={styles.icon} />
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
  backButtonImage: {
    width: 40, 
    height: 40, 
    resizeMode: "contain",
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
