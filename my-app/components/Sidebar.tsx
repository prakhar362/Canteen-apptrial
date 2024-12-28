// Sidebar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Return null if the sidebar is closed

  return (
    <View style={styles.sidebarContainer}>
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <Text style={styles.menuItem}>Home</Text>
        <Text style={styles.menuItem}>Orders</Text>
        <Text style={styles.menuItem}>Profile</Text>
        <Text style={styles.menuItem}>Settings</Text>
        <Text style={styles.menuItem}>Logout</Text>
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
