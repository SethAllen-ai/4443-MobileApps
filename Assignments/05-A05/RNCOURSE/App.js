import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import LoadingOverlay from './components/ui/LoadingOverlay';
import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import IconButton from './components/ui/IconButton';
import { useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function LandingRoot() {
  return (
    <SafeAreaProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: 'white',
            contentStyle: { backgroundColor: Colors.primary100 },
          }}
        >
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
          />
        </Stack.Navigator>
    </SafeAreaProvider>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: Colors.primary100 },
        }}
      >
        <Stack.Screen 
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
        <Stack.Screen 
          name="Profile"
          component={ProfileScreen}
          options ={{
            headerLeft: ({tintColor}) => (
              <IconButton
                icon="arrow-back"
                color={tintColor}
                size={24}
                onPress={() => {navigation.navigate('Welcome')}}
              />
            )
          }}
        />
      </Stack.Navigator>
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
