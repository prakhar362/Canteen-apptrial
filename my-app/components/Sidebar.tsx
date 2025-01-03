import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../app/navigation/AppNavigator"; // Import the types for navigation
import type { StackNavigationProp } from "@react-navigation/stack";

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
        
        <TouchableOpacity onPress={onClose}>
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
    alignSelf: "flex-end",
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
