import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import LeaguesScreen from './screens/LeaguesScreen';
import PicksScreen from './screens/PicksScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeagueDetailScreen from './screens/LeagueDetailScreen';
import RaceResultsScreen from './screens/RaceResultsScreen';

// Context
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
        // Web-specific styling
        ...(Platform.OS === 'web' && {
          tabBarStyle: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#eee',
          },
        }),
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Leagues"
        component={LeaguesScreen}
        options={{
          title: 'My Leagues',
        }}
      />
      <Tab.Screen
        name="Picks"
        component={PicksScreen}
        options={{
          title: 'My Picks',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="LeagueDetail" component={LeagueDetailScreen} />
            <Stack.Screen name="RaceResults" component={RaceResultsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App; 