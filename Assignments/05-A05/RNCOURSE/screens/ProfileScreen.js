import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../constants/styles';

function ProfileScreen () {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
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
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.primary800,
    borderRadius: 8,
  },
});