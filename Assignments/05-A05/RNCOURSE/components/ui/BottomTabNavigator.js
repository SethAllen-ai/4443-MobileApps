import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../../screens/WelcomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import RegistrationScreen from '../../screens/SignupScreen';
import LocationScreen from '../../screens/LocationScreen';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // if (route.name === 'Home') {
          //   iconName = focused ? 'home' : 'home';
          // } else if (route.name === 'Login') {
          if (route.name === 'Login') {
            iconName = focused ? 'login' : 'login';
          } else if (route.name === 'Registration') {
            iconName = focused ? 'app-registration' : 'app-registration';
          } else if (route.name === 'Location') {
            iconName = focused ? 'map' : 'map';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} type="material" color={color} size={size} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Registration" component={RegistrationScreen} />
      <Tab.Screen name="Location" component={LocationScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
