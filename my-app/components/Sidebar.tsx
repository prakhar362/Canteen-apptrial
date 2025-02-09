import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../app/navigation/AppNavigator"; // Import the types for navigation
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the navigation type
type NavigationProp = StackNavigationProp<RootStackParamList>;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigation = useNavigation<NavigationProp>(); // Use typed navigation

  if (!isOpen) return null; // Return null if the sidebar is closed

  // Navigation handler
  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any); // Navigate to the specified screen
    onClose(); // Close the sidebar after navigating
  };

  const handleLogout = async () => {
    try {
        const response = await fetch("https://canteen-web-1.onrender.com/app/api/v1/auth/logout", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            // Clear the token from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      console.log("Token removed from storage");
      // Confirm removal
      const removedToken = await AsyncStorage.getItem("userToken");
      console.log("After removal, Token:", removedToken); // Should log `null
            console.log('Logout successful');
            handleNavigation('LogIn'); // Navigate to the login screen
        } else {
            console.error('Logout failed:', await response.text());
        }
    } catch (error) {
        console.error('Logout failed:', error);
        // Handle error (e.g., show an error message to the user)
    }
};
  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        {/* Navigation Menu Items */}
        <TouchableOpacity onPress={() => handleNavigation("Home")}>
          <Text style={styles.menuItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation("Orders")}>
          <Text style={styles.menuItem}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation("Profile")}>
          <Text style={styles.menuItem}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation("ContactUs")}>
          <Text style={styles.menuItem}>Contact us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.menuItem}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 10,
  },
  sidebar: {
    backgroundColor: "#fff",
    width: 250,
    padding: 20,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
  },
  closeButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default Sidebar;
