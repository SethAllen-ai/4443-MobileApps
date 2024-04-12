import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoadingOverlay from './components/ui/LoadingOverlay';
import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import BottomTabNavigator from './components/ui/BottomTabNavigator';

const Stack = createNativeStackNavigator();

function LandingRoot() {
  return (
    <SafeAreaProvider>
      <AutocompleteDropdownContextProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.primary,
            contentStyle: { backgroundColor: Colors.primary100 },
          }}
        >
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen 
            name="Top" 
            component={BottomTabNavigator} 
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </AutocompleteDropdownContextProvider>
    </SafeAreaProvider>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <AutocompleteDropdownContextProvider>
        <Stack.Navigator>
          <Stack.Screen 
            name="Bottom" 
            component={BottomTabNavigator}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </AutocompleteDropdownContextProvider>
    </SafeAreaProvider>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <LandingRoot />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if(storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <LoadingOverlay message="Logging you in..." />;
  }
    
  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}