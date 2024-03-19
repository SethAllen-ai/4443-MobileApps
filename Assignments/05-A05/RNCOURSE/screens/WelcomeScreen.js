import { StyleSheet, View } from 'react-native';

import FlatButton from '../components/ui/FlatButton';
import { Colors } from '../constants/styles';

function WelcomeScreen({navigation}) {

  function screenNavigation() {
    navigation.navigate('Profile')
  }

  return (
    <View style={styles.rootContainer}>
      <FlatButton children={"Profile"} onPress={screenNavigation} />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
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
