import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure Notification Settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Register for Push Notifications & Get Token
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notifications permission not granted!");
    return;
  }


}
export async function scheduleLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Order is Ready! ",
      body: "Your food will be delivered soon!",
      sound: "default",
    },
    trigger: { seconds: 5 }, // Notification appears in 5 seconds
  });

  console.log("Local Notification Scheduled!");
}

// Function to send local notification for order updates
export const sendLocalNotification = async (orderId: string, status: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Order Status Updated 🚀🍕",
      body: `Your Order Id: ${orderId.slice(-4)} is ${status}.`,
      sound: "default",
    },
    trigger: null, // Instant notification
  });

  console.log(`Notification sent: Order ${orderId} is now ${status}`);
};


// Listen for Incoming Notifications
export function setupNotificationListener() {
  Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification Received:", notification);
  });

  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification Clicked:", response);
  });
}
