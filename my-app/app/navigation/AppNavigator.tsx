import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Splash from "../screens/SplashScreen";
import LogIn from "../screens/LogIn";
import Signup from "../screens/Signup";
import Home from "../screens/Home";
import FoodItemDetails from "../screens/FoodItemDetails";
import TrackOrder from "../screens/TrackOrder";
import PaymentSuccessful from "../screens/PaymentSuccessful";
import Profile from "../screens/Profile";
import Orders from "../screens/Orders";
import Cart from "../screens/Cart";
import { VerificationScreen, ForgotPasswordScreen } from "../screens/ForgetPass";
import ContactUs from "../../components/ContactUs";
import MakePayment from "../screens/PaymentPage";
import PasswordCreationScreen from "../screens/Newpass";
import { registerForPushNotificationsAsync, setupNotificationListener } from "../../components/Notifications"; // Ensure correct path

export type RootStackParamList = {
  Splash: undefined;
  LogIn: undefined;
  Signup: undefined;
  Home: undefined;
  FoodItemDetails: { foodItem: FoodItem };
  TrackOrder: undefined;
  PaymentSuccessful: undefined;
  MakePayment: undefined;
  Profile: undefined;
  Orders: undefined;
  Cart: { cartItems: { id: string; title: string; price: number; quantity: number }[] };
  ForgotPassword: undefined;
  Verification: { email: string };
  ContactUs: undefined;
  PasswordCreationScreen: { email: string; otp: string };
};

export interface FoodItem {
  availability: boolean;
  _id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
}

const Stack = createStackNavigator<RootStackParamList>();
const TOKEN_EXPIRY_TIME = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<"LogIn" | "Home">("LogIn");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const timestamp = await AsyncStorage.getItem("usertokenTimestamp");

        if (!token || !timestamp) {
          setInitialRoute("LogIn");
        } else {
          const storedTime = parseInt(timestamp, 10);
          const currentTime = Date.now();

          if (!storedTime || currentTime - storedTime > TOKEN_EXPIRY_TIME) {
            await AsyncStorage.multiRemove(["userToken", "usertokenTimestamp"]);
            setInitialRoute("LogIn");
          } else {
            setInitialRoute("Home");
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setInitialRoute("LogIn");
      }
    };

    const initializeApp = async () => {
      await checkToken();
      await registerForPushNotificationsAsync();
      setupNotificationListener();

      setTimeout(() => {
        setIsLoading(false);
      }, 7000); // Show splash screen for 7 seconds
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FoodItemDetails" component={FoodItemDetails} />
      <Stack.Screen name="MakePayment" component={MakePayment} />
      <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
      <Stack.Screen name="TrackOrder" component={TrackOrder} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="PasswordCreationScreen" component={PasswordCreationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
