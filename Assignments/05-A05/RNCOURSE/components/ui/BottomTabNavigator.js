import React from 'react';
import { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../../screens/WelcomeScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import SearchScreen from '../../screens/SearchScreen';
import LocationScreen from '../../screens/LocationScreen';
import IconButton from '../ui/IconButton';
import { Icon } from 'react-native-elements';
import { Colors } from '../../constants/styles';
import AuthContextProvider, { AuthContext } from '../../store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandingPage from '../../screens/LandingPage';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({navigation}) => {
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if(storedToken) {
        authCtx.authenticate(storedToken);
      }
    }

    fetchToken();
  }, []);

  if (authCtx.isAuthenticated) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.primary100 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: 'white',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              
              if (route.name === 'Profile') {
                iconName = focused ? 'login' : 'login';
              } else if (route.name === 'Welcome') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search';
              } else if (route.name === 'Location') {
                iconName = focused ? 'map' : 'map';
              }

              // You can return any component that you like here!
              return <Icon name={iconName} type="material" color={color} size={size} />;
            },
            tabBarActiveTintColor: 'yellow',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: { backgroundColor: Colors.primary500 },
          })}
        >
          {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options = {{
              headerRight: ({tintColor}) => (
                <IconButton 
                  icon="exit" 
                  color={tintColor} 
                  size={24} 
                  onPress={authCtx.logout} 
                />
              ),
              backgroundColor: Colors.primary100
            }}
          />
          <Tab.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options = {{
              headerRight: ({tintColor}) => (
                <IconButton 
                  icon="exit" 
                  color={tintColor} 
                  size={24} 
                  onPress={authCtx.logout} 
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen} 
            options = {{
              headerRight: ({tintColor}) => (
                <IconButton 
                  icon="exit" 
                  color={tintColor} 
                  size={24} 
                  onPress={authCtx.logout} 
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Location" 
            component={LocationScreen} 
            options = {{
              headerRight: ({tintColor}) => (
                <IconButton 
                  icon="exit" 
                  color={tintColor} 
                  size={24} 
                  onPress={authCtx.logout} 
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }
  else
  {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.primary100 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.primary,
            contentStyle: { backgroundColor: Colors.primary500 },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              
              if (route.name === 'Profile') {
                iconName = focused ? 'login' : 'login';
              } else if (route.name === 'Welcome') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search';
              } else if (route.name === 'Location') {
                iconName = focused ? 'map' : 'map';
              }

              // You can return any component that you like here!
              return <Icon name={iconName} type="material" color={color} size={size} />;
            },
            tabBarActiveTintColor: 'yellow',
            tabBarInactiveTintColor: Colors.primary,
            tabBarStyle: { backgroundColor: Colors.primary500 },
          })}
        >
          {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options ={{
              headerLeft: ({tintColor}) => (
                <IconButton
                  icon="arrow-back"
                  color={tintColor}
                  size={24}
                  onPress={() => {navigation.navigate('Landing')}}
                />
              )
            }}
          />
          <Tab.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options ={{
              headerLeft: ({tintColor}) => (
                <IconButton
                  icon="arrow-back"
                  color={tintColor}
                  size={24}
                  onPress={() => {navigation.navigate('Landing')}}
                />
              )
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options ={{
              headerLeft: ({tintColor}) => (
                <IconButton
                  icon="arrow-back"
                  color={tintColor}
                  size={24}
                  onPress={() => {navigation.navigate('Landing')}}
                />
              )
            }} 
          />
          <Tab.Screen 
            name="Location" 
            component={LocationScreen}
            options ={{
              headerLeft: ({tintColor}) => (
                <IconButton
                  icon="arrow-back"
                  color={tintColor}
                  size={24}
                  onPress={() => {navigation.navigate('Landing')}}
                />
              )
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }
};

export default BottomTabNavigator;
