import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { StackNavigationProp } from "@react-navigation/stack";

// Define the navigation type
type RootStackParamList = {
  LogIn: undefined;
  Signup: undefined;
  Home: undefined;
  forgotpassword: undefined;
};

type LogInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LogIn"
>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<LogInScreenNavigationProp>();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    } else {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form }),
      });
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      if(data.success && data.user){
        navigation.navigate("Home");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ImageBackground
      source={require("../assets/images/Bg_login.png")}
      className="flex-1 justify-center items-center opacity-100 bg-slate-700"
    >
      <Text
        className="text-white text-4xl font-extrabold mb-6"
        style={{ fontFamily: "Sen-Regular" }}
      >
        Sign In
      </Text>

      <Text
        className="text-white text-lg mb-4"
        style={{ fontFamily: "Sen-Regular" }}
      >
        Please sign in to your account
      </Text>

      <TextInput
        className="bg-gray-200 p-3 rounded-md mb-4 w-80 h-12"
        placeholder="Enter your email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(e) => setForm({ ...form, email: e })}
      />

      <View className="relative mb-6">
        <TextInput
          className="bg-gray-200 p-3 rounded-md w-80 h-12"
          placeholder="Enter your password"
          secureTextEntry={!isPasswordVisible}
          value={form.password}
          onChangeText={(e) => setForm({ ...form, password: e })}
        />
        <TouchableOpacity
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="relative top-1 -right-1/4" onPress={() => navigation.navigate("ForgotPassword")}>
        <Text className="text-orange-500 text-sm">Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-orange-500 p-3 rounded-md mt-16 w-80 h-12"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">Sign In</Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center">
        <Text className="text-white text-sm">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text className="text-orange-500 text-sm font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignIn;
