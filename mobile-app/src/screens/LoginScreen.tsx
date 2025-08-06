import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      // Navigation will be handled by the auth context
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FinalPoint</Text>
        <Text style={styles.subtitle}>F1 P10 Prediction League</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup' as never)}
        >
          <Text style={styles.signupButtonText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // Web-specific styling
    ...(Platform.OS === 'web' && {
      maxWidth: 400,
      marginHorizontal: 'auto',
      minHeight: '100vh',
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    // Web-specific input styling
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
      '&:focus': {
        borderColor: '#e91e63',
      },
    }),
  },
  loginButton: {
    backgroundColor: '#e91e63',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    // Web-specific button styling
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#c2185b',
      },
    }),
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    alignItems: 'center',
    // Web-specific styling
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.8,
      },
    }),
  },
  signupButtonText: {
    color: '#e91e63',
    fontSize: 14,
  },
});

export default LoginScreen; 