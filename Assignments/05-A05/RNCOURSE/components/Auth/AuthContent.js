import { useState, useCallback } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';


function AuthContent({ isLogin, onAuthenticate }) {
  const url = "https://discord.com/oauth2/authorize?client_id=1217880527483437198&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A53134&scope=identify+guilds";
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    firstName: false,
    lastName: false,
    email: false,
    userName: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  }

  function submitHandler(credentials) {
    let { firstName, lastName, email, confirmEmail, userName, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;

    if (!emailIsValid) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid,
      });
      return;
    }
    
    if (!isLogin) {
      const firstNameIsValid = firstName.length > 0;
      const lastNameIsValid = lastName.length > 0;
      const userNameIsValid = userName.length > 2;
      const emailsAreEqual = email === confirmEmail;
      const passwordsAreEqual = password === confirmPassword;

      if (
        !firstNameIsValid ||
        !lastNameIsValid ||
        !emailIsValid ||
        !userNameIsValid ||
        !passwordIsValid ||
        (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
      ) {
        Alert.alert('Invalid input', 'Please check your entered credentials.');
        setCredentialsInvalid({
          email: !emailIsValid,
          confirmEmail: !emailIsValid || !emailsAreEqual,
          password: !passwordIsValid,
          confirmPassword: !passwordIsValid || !passwordsAreEqual,
        });
        return;
      }
    }
    onAuthenticate({ firstName, lastName, email, userName, password });
  }

  const discordHandler = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <ScrollView style={[styles.authContent, isLogin && styles.LoginPage]}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? 'Create a new user' : 'Log in instead'}
        </FlatButton>
      </View>
      <Pressable style={({ pressed }) => [styles.discordButton, pressed && styles.pressed]} onPress={discordHandler}>
        <Text style={styles.buttonText}>DISCORD</Text>
      </Pressable>
    </ScrollView>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 10,
    marginHorizontal: 32,
    marginBottom: 10,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  LoginPage: {
    marginTop: 10,
    marginHorizontal: 32,
    marginBottom: 360,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
    marginBottom: 16,
  },
  discordButton: {
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary500,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});