import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator"; // Main navigator
import { CartProvider } from "../app/context/CartContext";
const App: React.FC = () => {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
      
    
  );
};

export default App;
