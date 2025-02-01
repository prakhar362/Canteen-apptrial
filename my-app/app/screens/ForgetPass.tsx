import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

type VerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Verification'
>;

type VerificationScreenRouteProp = RouteProp<RootStackParamList,'Verification'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

interface VerificationScreenProps {
  navigation: VerificationScreenNavigationProp;
  route: VerificationScreenRouteProp;
}

// ForgotPasswordScreen Component
export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if (validateEmail(email)) {
      setIsValidEmail(true);
      try {
        // Replace with actual API request
        const response = await fetch('https://canteen-web-1.onrender.com/app/api/forgotpassword/forgotpass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        if (response.ok) {
          // Navigate to verification screen with the email
          navigation.navigate('Verification', { email });
        } else {
          const data = await response.json();
          Alert.alert('Error', data.message || 'Something went wrong');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to send the code. Please try again later.');
      }
    } else {
      setIsValidEmail(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require("../assets/images/Back.png")} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Please sign in to your existing account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={[styles.input, !isValidEmail && styles.inputError]}
              placeholder="example@gmail.com"
              placeholderTextColor="#ffffff50"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsValidEmail(true);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!isValidEmail && (
              <Text style={styles.errorText}>Please enter a valid email address</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.button, !email && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={!email}
          >
            <Text style={styles.buttonText}>SEND CODE</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// VerificationScreen Component
export const VerificationScreen: React.FC<VerificationScreenProps> = ({ navigation, route }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(50);
  const { email } = route.params;
  const inputRefs = Array(4).fill(0).map(() => React.createRef<TextInput>());

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // Move to next input if text is entered
      if (text.length === 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        // Resend code logic (replace with actual API request)
        const response = await fetch('https://canteen-web-1.onrender.com/app/api/forgotpassword/forgotpass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setResendTimer(50);
        } else {
          const data = await response.json();
          Alert.alert('Error', data.message || 'Failed to resend code');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to resend code. Please try again later.');
      }
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    try {
      // Replace mock verification with actual API call
      const response = await fetch('http://localhost:5000/app/api/forgotpassword/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        // Navigate to the NewPassword screen after successful verification
        navigation.navigate('PasswordCreationScreen', { email, otp });
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Verification failed. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/Back.png")} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>We have sent a code to your email{'\n'}{email}</Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
              <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
                {resendTimer > 0 ? `Resend in ${resendTimer}sec` : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, !code.every(d => d) && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={!code.every(d => d)}
          >
            <Text style={styles.buttonText}>VERIFY</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF', // Changed background color to white
    },
    content: {
      flex: 1,
      padding: 20,
      paddingTop: 100, // Added padding to prevent overlap with the back button
    },
    backButton: {
      position: 'absolute',
      top: 50, // Adjusted to prevent overlap
      left: 20,
      zIndex: 1,
      width: 40,
      height: 40,
      backgroundColor: '#00000010', // Slightly darker for visibility
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      color: '#000', // Changed to black for contrast with white background
      fontSize: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000', // Changed to black for better readability
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#666', // A lighter gray for the subtitle
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      color: '#666', // Gray for labels
      fontSize: 12,
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#F5F5F5', // Light gray for input background
      borderRadius: 8,
      padding: 15,
      color: '#000', // Black text for input
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#DDD', // Subtle border for inputs
    },
    inputError: {
      borderColor: '#FF4444', // Red border for error
    },
    errorText: {
      color: '#FF4444',
      fontSize: 12,
      marginTop: 4,
    },
    button: {
      backgroundColor: '#FF6B00',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      backgroundColor: '#FF6B0080',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    codeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    codeInput: {
      backgroundColor: '#F5F5F5', // Light gray for input background
      borderRadius: 8,
      width: 60,
      height: 60,
      textAlign: 'center',
      color: '#000', // Black text for code input
      fontSize: 24,
      borderWidth: 1,
      borderColor: '#DDD',
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
    resendText: {
      color: '#666',
      textDecorationLine: 'underline',
    },
    resendTextDisabled: {
      opacity: 0.5,
    },
  });
  