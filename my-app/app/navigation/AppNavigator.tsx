import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../screens/SplashScreen";
import LogIn from "../screens/LogIn";
import Signup from "../screens/Signup";
import Home from "../screens/Home";
import FoodItemDetails from "../screens/FoodItemDetails"; // Import the details screen
import TrackOrder  from "../screens/TrackOrder";
import PaymentSuccessful from "../screens/PaymentSuccessful";
import Profile from "../screens/Profile";
import Orders from '../screens/Orders';
import Cart from "../screens/Cart";


export type RootStackParamList = {
  Splash: undefined;
  LogIn: undefined;
  Signup: undefined;
  Home: undefined;
  FoodItemDetails: { foodItem: FoodItem }; // foodItem must be passed
  TrackOrder:undefined;
  PaymentSuccessful:undefined;
  Profile:undefined;
  Orders:undefined;
  Cart: { cartItems: { id: string; title: string; price: number; quantity: number }[] };

};


export interface FoodItem {
  id: number;
  title: string;
  rating: number;
  time: string;
  imageUrl: string;
  category: string;
  price:number;
  description:string;
}

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false); // Hide splash screen after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSplashVisible ? (
        <Stack.Screen name="Splash" component={Splash} />
      ) : (
        <>
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="FoodItemDetails" component={FoodItemDetails} />
          <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
          <Stack.Screen name="TrackOrder" component={TrackOrder} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="Cart" component={Cart} />
          
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
