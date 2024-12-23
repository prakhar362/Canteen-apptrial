import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
// import axios from "axios"
type RootStackParamList = {
  LogIn: undefined;
  Signup: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;
const Signup = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>(); // Navigation hook

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async() => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
    } else if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
    } else {
      const response=await fetch("http://localhost:5000/api/v1/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...form})
      })
      console.log(response)
      const data=await response.json();
      console.log(data)
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ImageBackground
      source={require('../assets/images/Bg_login.png')} // Replace with your signup background image
      className="flex-1 justify-center items-center opacity-100 bg-slate-700">
      
      <Text className="text-white text-4xl font-extrabold mb-6" style={{ fontFamily: 'Sen-Regular' }}>
        Sign Up
      </Text>

      {/* Text below Sign Up */}
      <Text className="text-white text-lg mb-4" style={{ fontFamily: 'Sen-Regular' }}>
        Create a new account
      </Text>

      {/* Name Input */}
      <TextInput
        className="bg-gray-200 p-3 rounded-md mb-4 w-80 h-12"
        placeholder="Enter your username"
        value={form.username}
        onChangeText={(e) => setForm({ ...form, username: e })}
      />

      {/* Email Input */}
      <TextInput
        className="bg-gray-200 p-3 rounded-md mb-4 w-80 h-12"
        placeholder="Enter your email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(e) => setForm({ ...form, email: e })}
      />

      {/* Password Input */}
      <View className="relative mb-4">
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

      {/* Confirm Password Input */}
      <TextInput
        className="bg-gray-200 p-3 rounded-md mb-6 w-80 h-12"
        placeholder="Confirm your password"
        secureTextEntry={true}
        value={form.confirmPassword}
        onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
      />

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-orange-500 p-3 rounded-md mt-8 w-80 h-12"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">Sign Up</Text>
      </TouchableOpacity>

      {/* Already Have an Account */}
      <View className="mt-4 flex-row justify-center">
        <Text className="text-white text-sm">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
          <Text className="text-orange-500 text-sm font-semibold">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Signup;
