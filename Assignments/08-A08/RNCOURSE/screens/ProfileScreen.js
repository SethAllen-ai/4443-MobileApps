import axios from 'axios';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../constants/styles';

function ProfileScreen() {
 const [token, setToken] = useState();
 const [userData, setUserData] = useState();
 const url = `http://167.99.57.236:8084/users`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);

        const response = await axios.get(url);

        if (response.data.length === 0) {
          Alert.alert(
            'User Info Failed',
            'Failed to retrieve user data try again later!'
          );
        }

        // Use a local variable to track if a user is found
        let userFound = false;

        for (const user of response.data) {
          if (user.token === storedToken) {
            setUserData(user);
            userFound = true; // Mark that a user has been found
            break; // Exit the loop once the user is found
          }
        }

        // Show the alert only if no user was found
        if (!userFound) {
          Alert.alert(
            'User Info Failed',
            'No matching user found try again later'
          );
        }
      } catch (error) {
        Alert.alert(
          'Error Discovered',
          `${error}`
        );
      }
    };

    fetchData();
  }, []);

  function maskPassword(password) {
    return password.replace(/./g, '*');
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      {userData && (
        <>
          <Text style={styles.screenText}>
            Username: {userData.user}
          </Text>
          <Text style={styles.screenText}>
            Name: {userData.first}, {userData.last}
          </Text>
          <Text style={styles.screenText}>
            Email: {userData.email}
          </Text>
          <Text style={styles.screenText}>
            Password: {maskPassword(userData.password)}
          </Text>
        </>
      )}
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary100,
  },
  rootContainer: {
    margin: 16,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    backgroundColor: Colors.primary800,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    textAlign: 'center',
    color: Colors.primary100,
    fontSize: 18,
  },
});