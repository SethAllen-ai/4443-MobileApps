import { 
  Image, 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import  AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const LandingPage = ({navigation}) => {
 return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/DEGENERATE_GAMBLING_CLUB.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Our App</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <AntDesign name="login" size={25} color="black" />
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Welcome')}>
          <Ionicons name="home-sharp" size={25} color="black" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.space} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
          <FontAwesome5 name="pencil-alt" size={25} color="black" />
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 40,
  },
  button: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 300/2,
    marginTop: -175,
  },
  row: {
    flexDirection: 'row'
  },
});

export default LandingPage;