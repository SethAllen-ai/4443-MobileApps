import { axios } from 'axios';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import { Colors } from '../constants/styles';
import FlatButton from '../components/ui/FlatButton';
import LoadingOverlay from '../components/ui/LoadingOverlay';

function WelcomeScreen({navigation}) {
  const [candiesData, setCandiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   console.log("Fetching candies data....")
  //   axios.get('http://167.99.57.236:8084/candies')
  //     .then((response) => {
  //       console.log("Candies data:", response.data)
  //       setCandiesData(response.data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       Alert.alert(
  //         'Failed!',
  //         'Failed to get data.'
  //       );
  //       setIsLoading(false);
  //     });
  // }, []);

  const renderCandyItem = ({ item }) => (
    <View style={styles.candyItem}>
      <Text>{item.name}</Text>
      <Text>Price: ${item.price}</Text>
      {/* Add more details as needed */}
    </View>
  );

  console.log(candiesData);

  // if(isLoading) {
  //   return <LoadingOverlay message={'Loading Candy'}/>
  // }

  return (
    <View style={styles.rootContainer}>
      {/* {isLoading ? (
        <LoadingOverlay message={"Loading Candies"} />
      ) : (
      <FlatList 
        data={candiesData}
        renderItem={renderCandyItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
      )} */}
      <FlatButton children={"Profile"} onPress={() => navigation.navigate('Profile')} />
      <FlatButton children={"Search"} onPress={() => navigation.navigate('Search')} />
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
  candyItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: 'white', // Add a background color to the candy item for better visibility
    padding: 10,
    borderRadius: 8,
  },
});
