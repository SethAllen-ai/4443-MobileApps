import axios from 'axios';
import { Alert, Image, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import { Colors } from '../constants/styles';
import LoadingOverlay from '../components/ui/LoadingOverlay';

function WelcomeScreen() {
  const [candiesData, setCandiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedCandy, setSelectedCandy] = useState();

  useEffect(() => {
    axios.get('http://167.99.57.236:8084/candies')
      .then((response) => {
        setCandiesData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        Alert.alert(
          'Failed!',
          'Failed to get data.'
        );
        setIsLoading(false);
      });
  }, []);

  const renderCandyItem = ({ item }) => (
    <View style={styles.candyItem}>
      <TouchableOpacity onPress={() => {setSelectedCandy(item); pickedCandy(item);}}>
        <Text>{item.name}</Text>
        <Text>Price: ${item.price}</Text>
        <Image
          style={{ width: 50, height: 50, borderRadius: 300/2 }}
          source={{ uri: item.img_url }}
        />
      </TouchableOpacity>
    </View>
  );

  const pickedCandy = (item) => {
    if(!item) {
      Alert.alert(
        'No Candy Picked.',
        'Please select a candy first.'
      );
      return;
    }
    setSelectedCandy(item);
    setIsVisible(false);
  };

  if(isLoading) {
    return <LoadingOverlay message={'Loading Candy'}/>
  }

  function resetSelection () {
    setIsVisible(true);
  };

  if(!isVisible) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.screenText}>{selectedCandy.name}</Text>
          <Image
            style={{ width: 300, height: 300, borderRadius: 300/2 }}
            source={{ uri: selectedCandy.img_url }}
          />
          <Text style={styles.screenText}>Description: {selectedCandy.desc}</Text>
          <Text style={styles.screenText}>Price: ${selectedCandy.price}</Text>
          <TouchableOpacity style={styles.button} onPress={resetSelection}>
            <MaterialCommunityIcons name="backup-restore" size={55} color="white"/>
            <Text style={styles.buttonText}>Reset Selection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.rootContainer}>
      {isLoading ? (
        <LoadingOverlay message={"Loading Candies"} />
      ) : (
      <FlatList 
        data={candiesData}
        renderItem={renderCandyItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      )}
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
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
  rootContainer: {
    margin: 16,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.primary800,
    borderRadius: 8,
  },
  candyItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: Colors.primary, // Add a background color to the candy item for better visibility
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary500,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.primary,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },

});
