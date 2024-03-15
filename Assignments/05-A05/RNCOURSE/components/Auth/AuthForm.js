import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import Button from '../ui/Button';
import Input from './Input';

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredFirstName, setEnteredFirstName] = useState('');
  const [enteredLastName, setEnteredLastName] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'firstName':
        setEnteredFirstName(enteredValue);
        break;
      case 'lastName':
        setEnteredLastName(enteredValue);
        break;
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'username':
        setEnteredUsername(enteredValue);
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <SafeAreaView>
      <View>
        <View>
          {!isLogin && (
            <>
              <Input
                label="First Name"
                onUpdateValue={updateInputValueHandler.bind(this, 'firstName')}
                value={enteredFirstName} 
              />
              <Input
                label="Last Name"
                onUpdateValue={updateInputValueHandler.bind(this, 'lastName')}
                value={enteredLastName} 
              />
            </>
          )}
          <Input
            label="Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, 'email')}
            value={enteredEmail}
            keyboardType="email-address"
            isInvalid={emailIsInvalid}
          />
          {!isLogin && (
            <Input
              label="Confirm Email Address"
              onUpdateValue={updateInputValueHandler.bind(this, 'confirmEmail')}
              value={enteredConfirmEmail}
              keyboardType="email-address"
              isInvalid={emailsDontMatch}
            />
          )}
          {!isLogin && (
            <Input
              label="Username"
              onUpdateValue={updateInputValueHandler.bind(this, 'username')} 
              value={enteredUsername}
            />
          )}
          <Input
            label="Password"
            onUpdateValue={updateInputValueHandler.bind(this, 'password')}
            secure
            value={enteredPassword}
            isInvalid={passwordIsInvalid}
          />
          {!isLogin && (
            <Input
              label="Confirm Password"
              onUpdateValue={updateInputValueHandler.bind(
                this,
                'confirmPassword'
              )}
              secure
              value={enteredConfirmPassword}
              isInvalid={passwordsDontMatch}
            />
          )}
          <View style={styles.buttons}>
            <Button onPress={submitHandler}>
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});