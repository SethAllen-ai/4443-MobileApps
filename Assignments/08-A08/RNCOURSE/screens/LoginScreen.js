import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { login } from '../util/LoginAuth';
import { AuthContext } from '../store/auth-context';

function LoginScreen({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      if (token !== null) {
        authCtx.authenticate(token);
        navigation.navigate('Top');
      }
      else {
        setIsAuthenticating(false);
        Alert.alert(
          'Authentication failed!', 
          'Could not log you in. Please check your credentials or try again later!'
        );
      }
    } catch (error) {
      Alert.alert(
        'Authentication failed!', 
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
