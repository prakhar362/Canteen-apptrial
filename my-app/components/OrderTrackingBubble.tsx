import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Using Expo Icons

const OrderTrackingBubble = ({ 
  timeRemaining = 16, 
  status = "Your order is confirmed" 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <MaterialIcons name="access-time" size={24} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.timeText}>Arriving in {timeRemaining} mins</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.trackButton}>
        <Text style={styles.trackButtonText}>Track</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 165, 0, 0.5)', // Orange tint with transparency
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    backdropFilter: 'blur(10px)', // Soft blur effect (iOS & Web)
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    gap: 4,
  },
  timeText: {
    fontWeight: '600',
    color: '#fff',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  trackButton: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textGlow: {
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6, // Creates a soft glow effect
  },
  trackButtonText: {
    color: '#FF8C00', // Dark orange text for contrast
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderTrackingBubble;
