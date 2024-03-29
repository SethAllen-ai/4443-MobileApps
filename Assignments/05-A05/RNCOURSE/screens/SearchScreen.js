import axios from 'axios';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../constants/styles';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

function SearchScreen () {
  const [categoriesData, setCategoriesData] = useState([]);
  const [candiesData, setCandiesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedCandy, setSelectedCandy] = useState();
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    axios.get('http://167.99.57.236:8084/categories')
      .then((response) => {
        setCategoriesData(response.data.categories);
        setLoading(false);
      }) 
      .catch((error) => {
        Alert.alert(
          'Failed!',
          'Failed to get data.'
        );
        setLoading(false);
      });

    axios.get('http://167.99.57.236:8084/candies')
      .then((response) => {
        setCandiesData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        Alert.alert(
          'Failed!',
          'Failed to get data.'
        );
        setLoading(false);
      }); 
  }, []);

  // if (loading) {
  //   return <LoadingOverlay message={"Fetching Data!"} />;
  // }

  const filiteredCandiesData = selectedCategory && selectedCategory.id
    ? candiesData.filter(candy => candy.category_id === selectedCategory.id)
    : candiesData;


  const handleDisplayCandy = () => {
    if(!selectedCandy) {
      Alert.alert(
        'No Candy Picked.',
        'Please select a candy first.'
      );
      return;
    }
    setIsVisible(false);
  };

  function resetSelection () {
    setIsVisible(true);
    setSelectedCategory(null);
    setSelectedCandy(null);
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
      <View style={styles.container}>
        <Image 
          style={{
            width: 300,
            height: 300,
            borderRadius: 300/2,
            marginTop: -90,
            marginBottom: 18,
          }}
          source={require('../assets/DEGENERATE_GAMBLING_CLUB.png')}
        />
        <Text style={styles.screenText}>Categories</Text>
        <View style={{width: 300, marginTop: 10}}>
          <AutocompleteDropdown
            dataSet={categoriesData.map (categories => ({ id: categories.id, title: categories.name }))}
            inputContainerStyle={styles.title}
            onSelectItem={(item) => setSelectedCategory(item)}
          />
          <Text style={styles.screenText}>Candies</Text>
          <AutocompleteDropdown 
            dataSet={filiteredCandiesData.map (candy => ({ id: candy.id, title: candy.name }))}
            inputContainerStyle={styles.title}
            onSelectItem={(item) => {
              const selectedCandyDetails = candiesData.find(candy => candy.id === item.id);
              setSelectedCandy(selectedCandyDetails);
            }}
          />
          <TouchableOpacity style={styles.button} onPress={handleDisplayCandy}>
            <MaterialCommunityIcons name="candy" size={60} color="white" />
            <Text style={styles.buttonText}>Show Candy</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary100,
  },
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
});